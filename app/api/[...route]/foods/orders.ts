import { z } from 'zod'
import { Hono } from 'hono'
import { verifyAuth } from '@hono/auth-js'
import { createId } from '@paralleldrive/cuid2'
import { zValidator } from '@hono/zod-validator'
import { differenceInDays, subDays } from 'date-fns'

import {
  OrderHistoryProgress,
  Prisma,
  ShippingRole,
  StorePayment,
  UserRole,
} from '@prisma/client'

import { db } from '@/lib/db'
import { fillMissingDays, generateCode } from '@/lib/utils'

import {
  insertCheckoutSchema,
  insertReviewSchema,
  updateHistorySchema,
} from '@/features/foods/orders/schema'

const app = new Hono()
  .get(
    '/',
    verifyAuth(),
    zValidator(
      'query',
      z.object({
        status: z.nativeEnum(OrderHistoryProgress).optional(),
        today: z.preprocess((val) => val === 'true', z.boolean().optional()),
        from: z.string().optional(),
        to: z.string().optional(),
      })
    ),
    async (c) => {
      const auth = c.get('authUser')
      const { status, today, from, to } = c.req.valid('query')

      if (!auth.token?.sub || !auth.token?.selectedStore) {
        return c.json({ error: 'Usuário não autorizado' }, 401)
      }

      const user = await db.user.findUnique({ where: { id: auth.token.sub } })
      if (!user) return c.json({ error: 'Usuário não autorizado' }, 401)

      if (
        ![
          UserRole.OWNER as string,
          UserRole.MANAGER as string,
          UserRole.EMPLOYEE as string,
        ].includes(user.role)
      ) {
        return c.json({ error: 'Usuário sem autorização' }, 400)
      }
      const ownerId = user.role === UserRole.OWNER ? user.id : user.ownerId!

      const store = await db.store.findUnique({
        where: { id: auth.token.selectedStore.id, ownerId },
      })
      if (!store) {
        return c.json({ error: 'Usuário não autorizado' }, 401)
      }

      const conditions = []
      conditions.push(Prisma.sql`fo."storeId" = ${store.id}`)

      if (today) {
        const todayDate = new Date()
        todayDate.setHours(0, 0, 0, 0)
        const tomorrowDate = new Date(todayDate)
        tomorrowDate.setDate(tomorrowDate.getDate() + 1)

        conditions.push(
          Prisma.sql`fo."createdAt" >= ${todayDate} AND fo."createdAt" < ${tomorrowDate}`
        )
      }

      if (from) {
        const fromDate = new Date(from)
        conditions.push(Prisma.sql`fo."createdAt" >= ${fromDate}`)
      }

      if (to) {
        const toDate = new Date(to)
        toDate.setHours(23, 59, 59, 999)
        conditions.push(Prisma.sql`fo."createdAt" <= ${toDate}`)
      }

      if (status) {
        conditions.push(Prisma.sql`
          fo.id IN (
            SELECT ohfo."foodOrderId"
            FROM "OrderHistoryFoodOrder" ohfo
            JOIN "OrderHistory" oh ON ohfo."orderHistoryId" = oh.id
            WHERE oh.id = (
              SELECT oh2.id
              FROM "OrderHistoryFoodOrder" ohfo2
              JOIN "OrderHistory" oh2 ON ohfo2."orderHistoryId" = oh2.id
              WHERE ohfo2."foodOrderId" = ohfo."foodOrderId"
              ORDER BY oh2."createdAt" DESC
              LIMIT 1
            )
            AND oh."progress" = ${status}::\"OrderHistoryProgress\"
          )
        `)
      }

      const whereClause =
        conditions.length > 0
          ? Prisma.sql`WHERE ${Prisma.join(conditions, ' AND ')}`
          : Prisma.sql`WHERE 1=1`

      type FoodOrderResult = Array<{
        id: string
        code: string
        shippingRole: ShippingRole
        amount: number
        moneyChange: number | null
        payment: StorePayment
        createdAt: Date
        address: {
          city: string
          complement: string | null
          neighborhood: string
          number: string | null
          state: string
          street: string
          zipCode: string
        } | null
        customer: {
          name: string
          whatsApp: string
          email: string
        }
        items: Array<{
          id: string
          reviewed: boolean
          quantity: number
          amount: number
          obs: string | null
          food: {
            name: string
            image: string
            ingredients: string[]
          }
          additionals: Array<{
            additional: {
              name: string
            }
            options: Array<{
              amount: number
              quantity: number
              option: {
                name: string
              }
            }> | null
          }> | null
        }>
        shipping: {
          fee: number | null
          deadlineAt: number | null
        } | null
        histories: Array<{
          orderHistory: {
            id: string
            progress: OrderHistoryProgress
            createdAt: Date
          }
        }>
      }>

      const data = await db.$queryRaw<FoodOrderResult>`
        SELECT 
          fo.id,
          fo.code,
          fo."shippingRole",
          fo.amount,
          fo."moneyChange",
          fo.payment,
          fo."createdAt",
          
          -- Address
          jsonb_build_object(
            'city', a.city,
            'complement', a.complement,
            'neighborhood', a.neighborhood,
            'number', a.number,
            'state', a.state,
            'street', a.street,
            'zipCode', a."zipCode"
          ) as address,
          
          -- Customer
          jsonb_build_object(
            'name', u.name,
            'whatsApp', u."whatsApp",
            'email', u.email
          ) as customer,
          
          -- Items (this is complex and would need a subquery)
          (
            SELECT jsonb_agg(
              jsonb_build_object(
                'id', fi.id,
                'reviewed', fi.reviewed,
                'quantity', fi.quantity,
                'amount', fi.amount,
                'obs', fi.obs,
                'food', jsonb_build_object(
                  'name', f.name,
                  'image', f.image,
                  'ingredients', f.ingredients
                ),
                'additionals', (
                  SELECT jsonb_agg(
                    jsonb_build_object(
                      'additional', jsonb_build_object(
                        'name', fa.name
                      ),
                      'options', (
                        SELECT jsonb_agg(
                          jsonb_build_object(
                            'amount', fio.amount,
                            'quantity', fio.quantity,
                            'option', jsonb_build_object(
                              'name', fo_opt.name
                            )
                          )
                        )
                        FROM "FoodItemOption" fio
                        JOIN "FoodOption" fo_opt ON fio."optionId" = fo_opt.id
                        WHERE fio."foodItemAdditionalId" = fia.id
                      )
                    )
                  )
                  FROM "FoodItemAdditional" fia
                  JOIN "FoodAdditional" fa ON fia."additionalId" = fa.id
                  WHERE fia."foodItemId" = fi.id
                )
              )
            )
            FROM "FoodItem" fi
            JOIN "Food" f ON fi."foodId" = f.id
            WHERE fi."orderId" = fo.id
          ) as items,
          
          -- Shipping
          (
            SELECT jsonb_build_object(
              'fee', s.fee,
              'deadlineAt', s."deadlineAt"
            )
            FROM "Shipping" s
            WHERE s.id = fo."shippingId"
          ) as shipping,
          
          -- Histories (latest only)
          (
            SELECT jsonb_agg(
              jsonb_build_object(
                'orderHistory', oh
              )
            )
            FROM (
              SELECT oh.*
              FROM "OrderHistoryFoodOrder" ohfo
              JOIN "OrderHistory" oh ON ohfo."orderHistoryId" = oh.id
              WHERE ohfo."foodOrderId" = fo.id
              ORDER BY oh."createdAt" DESC
              LIMIT 1
            ) oh
          ) as histories
          
        FROM "FoodOrder" fo
        LEFT JOIN "Address" a ON a."foodOrderId" = fo.id
        LEFT JOIN "User" u ON fo."customerId" = u.id
        ${whereClause}
        ORDER BY fo."createdAt" DESC
      `

      return c.json({ data }, 200)
    }
  )
  .get('/analytics', verifyAuth(), async (c) => {
    const auth = c.get('authUser')

    if (!auth.token?.sub || !auth.token?.selectedStore) {
      return c.json({ error: 'Usuário não autorizado' }, 401)
    }

    const user = await db.user.findUnique({ where: { id: auth.token.sub } })
    if (!user) return c.json({ error: 'Usuário não autorizado' }, 401)

    if (
      ![
        UserRole.OWNER as string,
        UserRole.MANAGER as string,
        UserRole.EMPLOYEE as string,
      ].includes(user.role)
    ) {
      return c.json({ error: 'Usuário sem autorização' }, 400)
    }
    const ownerId = user.role === UserRole.OWNER ? user.id : user.ownerId!

    const store = await db.store.findUnique({
      where: { id: auth.token.selectedStore.id, ownerId },
    })

    if (!store) {
      return c.json({ error: 'Usuário não autorizado' }, 401)
    }

    type AnalyticsResult = {
      totalOrders: number
      totalCancelled: number
      totalRevenue: number
      averageTicket: number
    }

    const result = await db.$queryRaw<AnalyticsResult[]>(
      Prisma.sql`
        WITH order_data AS (
          SELECT 
            fo.id,
            fo.amount,
            oh.progress
          FROM "FoodOrder" fo
          JOIN "OrderHistoryFoodOrder" ohfo ON fo.id = ohfo."foodOrderId"
          JOIN "OrderHistory" oh ON ohfo."orderHistoryId" = oh.id
          WHERE fo."storeId" = ${store.id}
        ),
        total_orders AS (
          SELECT 
            COUNT(DISTINCT id)::int as count
          FROM order_data
        ),
        cancelled_orders AS (
          SELECT 
            COUNT(DISTINCT id)::int as count
          FROM order_data
          WHERE progress = 'CANCELLED'
        ),
        delivered_orders AS (
          SELECT 
            COUNT(DISTINCT id)::int as count,
            COALESCE(SUM(amount), 0)::float as total_amount
          FROM order_data
          WHERE progress = 'DELIVERED'
        )
        SELECT 
          (SELECT count FROM total_orders) as "totalOrders",
          (SELECT count FROM cancelled_orders) as "totalCancelled",
          (SELECT total_amount FROM delivered_orders) as "totalRevenue",
          CASE 
            WHEN (SELECT count FROM delivered_orders) > 0 
            THEN (SELECT total_amount FROM delivered_orders) / (SELECT count FROM delivered_orders)
            ELSE 0
          END as "averageTicket"
        `
    )

    const { totalOrders, totalCancelled, totalRevenue, averageTicket } =
      result[0]

    return c.json(
      {
        data: {
          totalOrders,
          totalCancelled,
          totalRevenue,
          averageTicket,
        },
      },
      200
    )
  })
  .get('/overview', verifyAuth(), async (c) => {
    const auth = c.get('authUser')

    if (!auth.token?.sub) {
      return c.json({ error: 'Usuário não autorizado' }, 401)
    }

    if (!auth.token?.selectedStore) {
      return c.json({ error: 'Usuário não autorizado' }, 401)
    }

    const user = await db.user.findUnique({ where: { id: auth.token.sub } })
    if (!user) return c.json({ error: 'Usuário não autorizado' }, 401)

    if (
      ![
        UserRole.OWNER as string,
        UserRole.MANAGER as string,
        UserRole.EMPLOYEE as string,
      ].includes(user.role)
    ) {
      return c.json({ error: 'Usuário sem autorização' }, 400)
    }
    const ownerId = user.role === UserRole.OWNER ? user.id : user.ownerId!

    const store = await db.store.findUnique({
      where: { id: auth.token.selectedStore.id, ownerId },
    })

    if (!store) {
      return c.json({ error: 'Usuário não autorizado' }, 401)
    }

    const { startDate: startDateParam, endDate: endDateParam } = c.req.query()
    const now = new Date()
    const startDate = startDateParam
      ? new Date(startDateParam)
      : new Date(now.getFullYear(), now.getMonth(), 1)

    const endDate = endDateParam
      ? new Date(endDateParam)
      : new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)

    const periodLength = differenceInDays(endDate, startDate) + 1
    const lastPeriodStart = subDays(startDate, periodLength)
    const lastPeriodEnd = subDays(endDate, periodLength)

    type AnalyticsResult = {
      dailyMetrics: Array<{
        date: string
        delivered: number
        lastDelivered: number
        cancelled: number
        lastCancelled: number
        invoicing: number
        lastInvoicing: number
        avgTicket: number
        lastAvgTicket: number
        count: number
        lastCount: number
      }>
      paymentMethods: Array<{
        payment: string
        count: number
        percentage: number
      }>
      topProducts: Array<{
        id: string
        name: string
        quantity: number
        total_amount: number
      }>
    }

    const result = await db.$queryRaw<AnalyticsResult[]>(
      Prisma.sql`
      WITH current_period_data AS (
        SELECT 
          fo.id as order_id,
          fo."createdAt" as created_at,
          fo.amount as amount,
          fo.payment as payment,
          fo."storeId" as store_id,
          MAX(CASE WHEN oh.progress = 'DELIVERED' THEN 1 ELSE 0 END) as is_delivered,
          MAX(CASE WHEN oh.progress = 'CANCELLED' THEN 1 ELSE 0 END) as is_cancelled
        FROM "FoodOrder" fo
        LEFT JOIN "OrderHistoryFoodOrder" ohfo ON fo.id = ohfo."foodOrderId"
        LEFT JOIN "OrderHistory" oh ON ohfo."orderHistoryId" = oh.id
        WHERE 
          fo."storeId" = ${store.id}
          AND fo."createdAt" >= ${startDate}
          AND fo."createdAt" <= ${endDate}
        GROUP BY fo.id, fo."createdAt", fo.amount, fo.payment, fo."storeId"
      ),
      last_period_data AS (
        SELECT 
          fo.id as order_id,
          fo."createdAt" as created_at,
          fo.amount as amount,
          fo."storeId" as store_id,
          MAX(CASE WHEN oh.progress = 'DELIVERED' THEN 1 ELSE 0 END) as is_delivered,
          MAX(CASE WHEN oh.progress = 'CANCELLED' THEN 1 ELSE 0 END) as is_cancelled
        FROM "FoodOrder" fo
        LEFT JOIN "OrderHistoryFoodOrder" ohfo ON fo.id = ohfo."foodOrderId"
        LEFT JOIN "OrderHistory" oh ON ohfo."orderHistoryId" = oh.id
        WHERE 
          fo."storeId" = ${store.id}
          AND fo."createdAt" >= ${lastPeriodStart}
          AND fo."createdAt" <= ${lastPeriodEnd}
        GROUP BY fo.id, fo."createdAt", fo.amount, fo."storeId"
      ),
      current_daily_metrics AS (
        SELECT 
          TO_CHAR(DATE(o.created_at), 'YYYY-MM-DD') as date,
          COUNT(o.order_id)::float as count,
          COUNT(CASE WHEN o.is_delivered = 1 THEN 1 END)::float as delivered,
          COUNT(CASE WHEN o.is_cancelled = 1 THEN 1 END)::float as cancelled,
          SUM(CASE WHEN o.is_delivered = 1 THEN o.amount ELSE 0 END)::float as invoicing,
          CASE 
            WHEN COUNT(CASE WHEN o.is_delivered = 1 THEN 1 END) > 0 
            THEN SUM(CASE WHEN o.is_delivered = 1 THEN o.amount ELSE 0 END)::float / COUNT(CASE WHEN o.is_delivered = 1 THEN 1 END)::float 
            ELSE 0 
          END as avg_ticket
        FROM current_period_data o
        GROUP BY DATE(o.created_at)
      ),
      last_daily_metrics AS (
        SELECT 
          TO_CHAR(DATE(o.created_at), 'YYYY-MM-DD') as date,
          COUNT(o.order_id)::float as count,
          COUNT(CASE WHEN o.is_delivered = 1 THEN 1 END)::float as delivered,
          COUNT(CASE WHEN o.is_cancelled = 1 THEN 1 END)::float as cancelled,
          SUM(CASE WHEN o.is_delivered = 1 THEN o.amount ELSE 0 END)::float as invoicing,
          CASE 
            WHEN COUNT(CASE WHEN o.is_delivered = 1 THEN 1 END) > 0 
            THEN SUM(CASE WHEN o.is_delivered = 1 THEN o.amount ELSE 0 END)::float / COUNT(CASE WHEN o.is_delivered = 1 THEN 1 END)::float 
            ELSE 0 
          END as avg_ticket
        FROM last_period_data o
        GROUP BY DATE(o.created_at)
      ),
      combined_daily_metrics AS (
        SELECT 
          c.date,
          c.count,
          COALESCE(l.count, 0) as last_count,
          c.delivered,
          COALESCE(l.delivered, 0) as last_delivered,
          c.cancelled,
          COALESCE(l.cancelled, 0) as last_cancelled,
          c.invoicing,
          COALESCE(l.invoicing, 0) as last_invoicing,
          c.avg_ticket,
          COALESCE(l.avg_ticket, 0) as last_avg_ticket
        FROM current_daily_metrics c
        LEFT JOIN last_daily_metrics l ON 
          TO_DATE(l.date, 'YYYY-MM-DD') = TO_DATE(c.date, 'YYYY-MM-DD') - INTERVAL '${periodLength} days'
        ORDER BY c.date ASC
      ),
      payment_methods AS (
        SELECT 
          payment::text as payment_method,
          COUNT(*)::float as count,
          (COUNT(*)::float / (SELECT COUNT(*)::float FROM current_period_data)) * 100 as percentage
        FROM current_period_data
        GROUP BY payment
        ORDER BY count DESC
      ),
      top_products AS (
        SELECT 
          f.id,
          f.name,
          SUM(fi.quantity)::float as quantity,
          SUM(fi.amount * fi.quantity)::float as total_amount
        FROM "Food" f
        JOIN "FoodItem" fi ON f.id = fi."foodId"
        JOIN "FoodOrder" fo ON fi."orderId" = fo.id
        LEFT JOIN "OrderHistoryFoodOrder" ohfo ON fo.id = ohfo."foodOrderId"
        LEFT JOIN "OrderHistory" oh ON ohfo."orderHistoryId" = oh.id
        WHERE 
          fo."storeId" = ${store.id}
          AND fo."createdAt" >= ${startDate}
          AND fo."createdAt" <= ${endDate}
          AND oh.progress = 'DELIVERED'
        GROUP BY f.id, f.name
        ORDER BY quantity DESC
        LIMIT 5
      )
      SELECT 
        (
          SELECT COALESCE(jsonb_agg(
            jsonb_build_object(
              'date', date,
              'count', count,
              'lastCount', last_count,
              'delivered', delivered,
              'lastDelivered', last_delivered,
              'cancelled', cancelled,
              'lastCancelled', last_cancelled,
              'invoicing', invoicing,
              'lastInvoicing', last_invoicing,
              'avgTicket', avg_ticket,
              'lastAvgTicket', last_avg_ticket
            )
          ), '[]'::jsonb) FROM combined_daily_metrics
        ) as "dailyMetrics",
        (
          SELECT COALESCE(jsonb_agg(
            jsonb_build_object(
              'payment', payment_method,
              'count', count,
              'percentage', percentage
            )
          ), '[]'::jsonb) FROM payment_methods
        ) as "paymentMethods",
        (
          SELECT COALESCE(jsonb_agg(
            jsonb_build_object(
              'id', id,
              'name', name,
              'quantity', quantity,
              'total_amount', total_amount
            )
          ), '[]'::jsonb) FROM top_products
        ) as "topProducts"
      `
    )

    const { dailyMetrics, paymentMethods, topProducts } = result[0]

    return c.json({ data: { dailyMetrics, paymentMethods, topProducts } }, 200)
  })
  .get('/summary', verifyAuth(), async (c) => {
    const auth = c.get('authUser')

    if (!auth.token?.sub) {
      return c.json({ error: 'Usuário não autorizado' }, 401)
    }

    if (!auth.token?.selectedStore) {
      return c.json({ error: 'Usuário não autorizado' }, 401)
    }

    const user = await db.user.findUnique({ where: { id: auth.token.sub } })
    if (!user) return c.json({ error: 'Usuário não autorizado' }, 401)

    if (
      ![
        UserRole.OWNER as string,
        UserRole.MANAGER as string,
        UserRole.EMPLOYEE as string,
      ].includes(user.role)
    ) {
      return c.json({ error: 'Usuário sem autorização' }, 400)
    }
    const ownerId = user.role === UserRole.OWNER ? user.id : user.ownerId!

    const store = await db.store.findUnique({
      where: { id: auth.token.selectedStore.id, ownerId },
    })

    if (!store) {
      return c.json({ error: 'Usuário não autorizado' }, 401)
    }

    // const { startDate: startDateParam, endDate: endDateParam } = c.req.query()
    // const now = new Date()
    // const startDate = startDateParam
    //   ? new Date(startDateParam)
    //   : new Date(now.getFullYear(), now.getMonth(), 1)

    // const endDate = endDateParam
    //   ? new Date(endDateParam)
    //   : new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)

    // const { startDate: startDateParam, endDate: endDateParam } = c.req.query()
    // const now = new Date()

    // const startDate = startDateParam
    //   ? new Date(startDateParam)
    //   : new Date(now.getFullYear(), now.getMonth(), now.getDate())

    // const endDate = endDateParam
    //   ? new Date(endDateParam)
    //   : new Date(startDate.getTime() + 6 * 24 * 60 * 60 * 1000)
    // endDate.setHours(23, 59, 59)

    const { startDate: startDateParam, endDate: endDateParam } = c.req.query()
    const now = new Date()

    const endDate = endDateParam
      ? new Date(endDateParam)
      : new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          23,
          59,
          59,
          999
        )

    const startDate = startDateParam
      ? new Date(startDateParam)
      : new Date(endDate.getTime() - 6 * 24 * 60 * 60 * 1000)

    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0,
      0
    )
    const todayEnd = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999
    )

    type SummaryResult = {
      summary: Array<{
        date: string
        count: number
        total: number
        delivered: number
        cancelled: number
        invoicing: number
      }>
      mostSales: Array<{
        id: string
        name: string
        quantity: number
        total_amount: number
      }>
      overview: {
        totalOrders: number
        pendingOrders: number
        customers: number
        dailySales: number
      }
    }

    const result = await db.$queryRaw<SummaryResult[]>(
      Prisma.sql`
      WITH order_data AS (
        SELECT 
          fo.id as order_id,
          fo."createdAt" as created_at,
          fo.amount as amount,
          fo."storeId" as store_id,
          fo."customerId" as customer_id,
          MAX(CASE WHEN oh.progress = 'DELIVERED' THEN 1 ELSE 0 END) as is_delivered,
          MAX(CASE WHEN oh.progress = 'CANCELLED' THEN 1 ELSE 0 END) as is_cancelled,
          MAX(CASE WHEN oh.progress = 'PENDING' THEN 1 ELSE 0 END) as is_pending
        FROM "FoodOrder" fo
        LEFT JOIN "OrderHistoryFoodOrder" ohfo ON fo.id = ohfo."foodOrderId"
        LEFT JOIN "OrderHistory" oh ON ohfo."orderHistoryId" = oh.id
        WHERE 
          fo."storeId" = ${store.id}
        GROUP BY fo.id, fo."createdAt", fo.amount, fo."storeId", fo."customerId"
      ),
      daily_summary AS (
        SELECT 
          TO_CHAR(DATE(o.created_at), 'YYYY-MM-DD') as date,
          COUNT(o.order_id)::float as count,
          SUM(o.amount)::float as total,
          COUNT(CASE WHEN o.is_delivered = 1 THEN 1 END)::float as delivered,
          COUNT(CASE WHEN o.is_cancelled = 1 THEN 1 END)::float as cancelled,
          SUM(CASE WHEN o.is_delivered = 1 THEN o.amount ELSE 0 END)::float as invoicing
        FROM order_data o
        WHERE 
          o.created_at >= ${startDate}
          AND o.created_at <= ${endDate}
        GROUP BY DATE(o.created_at)
        ORDER BY date ASC
      ),
      top_products AS (
        SELECT 
          f.id,
          f.name,
          SUM(fi.quantity)::float as quantity,
          SUM(fi.amount * fi.quantity)::float as total_amount
        FROM "Food" f
        JOIN "FoodItem" fi ON f.id = fi."foodId"
        JOIN "FoodOrder" fo ON fi."orderId" = fo.id
        WHERE 
          fo."storeId" = ${store.id}
          AND fo."createdAt" >= ${startDate}
          AND fo."createdAt" <= ${endDate}
        GROUP BY f.id, f.name
        ORDER BY quantity DESC
        LIMIT 5
      ),
      today_orders AS (
        SELECT 
          COUNT(o.order_id)::float as total_orders,
          COUNT(CASE WHEN o.is_pending = 1 AND o.is_delivered = 0 AND o.is_cancelled = 0 THEN 1 END)::float as pending_orders,
          COUNT(DISTINCT o.customer_id)::float as customers,
          SUM(o.amount)::float as daily_sales
        FROM order_data o
        WHERE 
          o.created_at >= ${todayStart}
          AND o.created_at <= ${todayEnd}
          AND o.store_id = ${store.id}
      )
      SELECT 
        (
          SELECT COALESCE(jsonb_agg(
            jsonb_build_object(
              'date', date,
              'count', count,
              'total', total,
              'delivered', delivered,
              'cancelled', cancelled,
              'invoicing', invoicing
            )
          ), '[]'::jsonb) FROM daily_summary
        ) as "summary",
        (
          SELECT COALESCE(jsonb_agg(
            jsonb_build_object(
              'id', id,
              'name', name,
              'quantity', quantity,
              'total_amount', total_amount
            )
          ), '[]'::jsonb) FROM top_products
        ) as "mostSales",
        (
          SELECT jsonb_build_object(
            'totalOrders', COALESCE(total_orders, 0),
            'pendingOrders', COALESCE(pending_orders, 0),
            'customers', COALESCE(customers, 0),
            'dailySales', COALESCE(daily_sales, 0)
          ) FROM today_orders
        ) as "overview"
      `
    )

    const { summary, mostSales, overview } = result[0]

    const fillSummary = fillMissingDays(
      summary,
      startDate,
      endDate
    ) as SummaryResult['summary']

    return c.json(
      {
        data: { summary: fillSummary, mostSales, overview },
        meta: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      },
      200
    )
  })
  .get(
    '/stores/:storeId',
    verifyAuth(),
    zValidator('param', z.object({ storeId: z.string().optional() })),
    async (c) => {
      const auth = c.get('authUser')
      const { storeId } = c.req.valid('param')

      if (!auth.token?.sub) {
        return c.json({ error: 'Usuário não autorizado' }, 401)
      }

      if (!storeId) {
        return c.json({ error: 'Identificador não encontrado' }, 400)
      }

      const store = await db.store.findUnique({ where: { id: storeId } })
      if (!store) {
        return c.json({ error: 'Loja não cadastrada' }, 404)
      }

      const user = await db.user.findUnique({
        where: { id: auth.token.sub },
      })
      if (!user) return c.json({ error: 'Usuário não autorizado' }, 401)

      if (![UserRole.CUSTOMER as string].includes(user.role)) {
        return c.json({ error: 'Usuário sem autorização' }, 400)
      }

      const data = await db.foodOrder.findMany({
        where: { storeId: store.id },
        select: {
          id: true,
          code: true,
          shippingRole: true,
          amount: true,
          moneyChange: true,
          payment: true,
          address: {
            select: {
              city: true,
              complement: true,
              neighborhood: true,
              number: true,
              state: true,
              street: true,
              zipCode: true,
            },
          },
          items: {
            select: {
              id: true,
              reviewed: true,
              review: true,
              quantity: true,
              amount: true,
              obs: true,

              food: {
                select: {
                  name: true,
                  image: true,
                  ingredients: true,
                },
              },

              additionals: {
                select: {
                  additional: {
                    select: {
                      name: true,
                    },
                  },
                  options: {
                    select: {
                      amount: true,
                      quantity: true,
                      option: {
                        select: {
                          name: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          shipping: {
            select: {
              fee: true,
              deadlineAt: true,
            },
          },
          histories: {
            select: {
              orderHistory: true,
            },
            orderBy: { orderHistory: { createdAt: 'desc' } },
            take: 1,
          },
        },
        orderBy: { createdAt: 'desc' },
      })

      return c.json({ data }, 200)
    }
  )
  .post(
    '/',
    verifyAuth(),
    zValidator('json', insertCheckoutSchema),
    async (c) => {
      const auth = c.get('authUser')
      const validatedFields = c.req.valid('json')

      if (!validatedFields) return c.json({ error: 'Campos inválidos' }, 400)
      const { storeId, payment, shippingRole, shippingId, items, moneyChange } =
        validatedFields

      if (!auth.token?.sub) {
        return c.json({ error: 'Usuário não autorizado' }, 401)
      }

      const user = await db.user.findUnique({
        where: { id: auth.token.sub },
        select: {
          id: true,
          role: true,
          address: true,
        },
      })
      if (!user) return c.json({ error: 'Usuário não autorizado' }, 401)

      if (![UserRole.CUSTOMER as string].includes(user.role)) {
        return c.json({ error: 'Usuário sem autorização' }, 400)
      }

      const store = await db.store.findUnique({
        where: { id: storeId },
        select: {
          id: true,
          payment: true,
          shippings: true,
          shippingRole: true,
        },
      })
      if (!store) {
        return c.json({ error: 'Loja não cadastrada' }, 404)
      }

      if (!store.payment.includes(payment)) {
        return c.json({ error: 'Forma de pagamento inválida' }, 400)
      }

      if (!store.shippingRole.includes(shippingRole)) {
        return c.json({ error: 'Método de entrega inválida' }, 400)
      }

      const shipping = store.shippings.find((item) => item.id === shippingId)
      if (shippingId && !shipping) {
        return c.json({ error: 'Método de entrega inválida' }, 400)
      }

      let addressData = undefined
      if (shippingRole === 'DELIVERY' && shipping) {
        if (
          user.address &&
          user.address.neighborhood === shipping.neighborhood
        ) {
          addressData = {
            create: {
              zipCode: user.address.zipCode,
              street: user.address.street,
              neighborhood: user.address.neighborhood,
              city: user.address.city,
              state: user.address.state,
              number: user.address.number,
              complement: user.address.complement,
            },
          }
        }
      }

      const foodItems = await Promise.all(
        items.map(async (item) => {
          const food = await db.food.findUnique({
            where: { id: item.productId },
            include: {
              additionals: {
                select: {
                  foodAdditional: {
                    select: {
                      id: true,
                      options: { select: { foodOption: true } },
                    },
                  },
                },
              },
            },
          })
          const additionals = item.additionals.map((additional) => {
            const add = food?.additionals.find(
              (i) => i.foodAdditional.id === additional.additionalId
            )
            const options = additional.options.map((i) => {
              const option = add?.foodAdditional.options.find(
                (v) => v.foodOption.id === i.optionId
              )

              const quantity = i.quantity
              const price = option?.foodOption.price

              return {
                optionId: option?.foodOption.id,
                quantity,
                amount: quantity * price!,
              }
            })

            return {
              id: add?.foodAdditional.id,
              options,
            }
          })

          const { price, promotion } = food!
          const additionalAmount = additionals.reduce((acc, additional) => {
            const sumOptions = additional.options.reduce(
              (sum, option) => sum + option.amount,
              0
            )
            return acc + sumOptions
          }, 0)
          const amount = (promotion || price) + additionalAmount

          return {
            foodId: food!.id,
            additionals: additionals.map((additional) => ({
              additionalId: additional.id,
              options: additional.options,
            })),

            options: additionals.flatMap((additionals) => additionals.options),
            amount,
            quantity: item.quantity,
            obs: item.obs,
          }
        })
      )

      const subAmount = foodItems.reduce(
        (acc, item) => acc + item.amount * item.quantity,
        0
      )
      const amount = (shipping?.fee || 0) + subAmount

      await db.foodOrder.create({
        data: {
          code: generateCode(),
          amount,
          moneyChange,
          payment: store.payment.find((p) => p === payment)!,
          shippingRole: store.shippingRole.find((s) => s === shippingRole)!,
          storeId: store.id,
          customerId: user.id,
          shippingId: shipping?.id,

          items: {
            create: foodItems.map((item) => ({
              food: { connect: { id: item.foodId } },
              quantity: item.quantity,
              amount: item.amount,
              obs: item.obs,

              additionals: {
                create: item.additionals.map((additional) => ({
                  additional: { connect: { id: additional.additionalId } },
                  options: {
                    create: additional.options.map((option) => ({
                      option: { connect: { id: option.optionId } },
                      quantity: option.quantity,
                      amount: option.amount,
                    })),
                  },
                })),
              },
            })),
          },

          histories: {
            create: { orderHistory: { create: { progress: 'PENDING' } } },
          },

          ...(addressData ? { address: addressData } : {}),
        },
      })

      for (const food of foodItems) {
        const currentFood = await db.food.findUnique({
          where: { id: food.foodId },
          select: { sales: true },
        })

        await db.food.update({
          where: { id: food.foodId },
          data: {
            sales: (currentFood?.sales || 0) + food.quantity,
          },
        })
      }

      return c.json({ success: 'Pedido realizado com sucesso' }, 201)
    }
  )
  .post(
    '/review/:id',
    verifyAuth(),
    zValidator('param', z.object({ id: z.string().optional() })),
    zValidator('query', z.object({ itemId: z.string().optional() })),
    zValidator('json', insertReviewSchema),
    async (c) => {
      const auth = c.get('authUser')
      const { id } = c.req.valid('param')
      const { itemId } = c.req.valid('query')
      const validatedFields = c.req.valid('json')
      const { review } = validatedFields

      if (!validatedFields) return c.json({ error: 'Campos inválidos' }, 400)

      if (!id) {
        return c.json({ error: 'Identificador não encontrado' }, 400)
      }

      if (!auth.token?.sub) {
        return c.json({ error: 'Usuário não autorizado' }, 401)
      }

      const user = await db.user.findUnique({
        where: { id: auth.token.sub },
      })
      if (!user) return c.json({ error: 'Usuário não autorizado' }, 401)

      if (![UserRole.CUSTOMER as string].includes(user.role)) {
        return c.json({ error: 'Usuário sem autorização' }, 400)
      }

      const order = await db.foodOrder.findUnique({
        where: { id, customerId: user.id },
        select: {
          id: true,
          items: {
            select: {
              id: true,
              reviewed: true,
              foodId: true,
            },
          },
        },
      })
      if (!order) return c.json({ error: 'Pedido inválido' }, 200)

      const itemToReview = order.items.find((item) => item.id === itemId)
      if (!itemToReview) {
        return c.json({ error: 'Item não encontrado no pedido' }, 400)
      }
      if (itemToReview.reviewed) {
        return c.json({ error: 'Item já avaliado' }, 400)
      }

      const food = await db.food.findUnique({
        where: { id: itemToReview.foodId },
        select: { reviews: true, reviewsAmount: true },
      })
      if (!food) {
        return c.json({ error: 'Produto não encontrado' }, 400)
      }

      const currentReviews = food.reviews || 0
      const currentReviewsAmount = food.reviewsAmount || 0
      const newReviewsAmount = currentReviewsAmount + 1
      const newTotalReviews = currentReviews + review
      const newAverage = newTotalReviews / newReviewsAmount

      await db.$transaction([
        db.foodItem.update({
          where: { id: itemId },
          data: { reviewed: true, review },
        }),
        db.food.update({
          where: { id: itemToReview.foodId },
          data: {
            reviewsAmount: newReviewsAmount,
            reviews: newTotalReviews,
            reviewsAvg: newAverage,
          },
        }),
      ])

      return c.json({ success: 'Avaliação registrada com sucesso' }, 200)
    }
  )
  .patch(
    '/:id/history',
    verifyAuth(),
    zValidator('param', z.object({ id: z.string().optional() })),
    zValidator('json', updateHistorySchema),
    async (c) => {
      const auth = c.get('authUser')
      const { id } = c.req.valid('param')
      const validatedFields = c.req.valid('json')

      if (!validatedFields) return c.json({ error: 'Campos inválidos' }, 400)

      if (!id) {
        return c.json({ error: 'Identificador não encontrado' }, 400)
      }

      if (!auth.token?.sub) {
        return c.json({ error: 'Usuário não autorizado' }, 401)
      }

      const user = await db.user.findUnique({
        where: { id: auth.token.sub },
      })
      if (!user) return c.json({ error: 'Usuário não autorizado' }, 401)

      if (
        ![
          UserRole.OWNER as string,
          UserRole.MANAGER as string,
          UserRole.EMPLOYEE as string,
        ].includes(user.role)
      ) {
        return c.json({ error: 'Usuário sem autorização' }, 400)
      }

      await db.foodOrder.update({
        where: { id },
        data: {
          histories: {
            create: {
              orderHistory: { create: { progress: validatedFields.progress } },
            },
          },
        },
      })

      return c.json({ success: 'Situação atualizada com sucesso' }, 200)
    }
  )

export default app
