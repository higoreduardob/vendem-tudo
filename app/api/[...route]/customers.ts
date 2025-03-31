import { z } from 'zod'
import { Hono } from 'hono'
import { verifyAuth } from '@hono/auth-js'
import { zValidator } from '@hono/zod-validator'

import { Prisma, UserRole } from '@prisma/client'

import { db } from '@/lib/db'

const app = new Hono().get('/analytics', verifyAuth(), async (c) => {
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
    totalCustomers: number
    avgTicket: number
    mostDeliveredNeighborhood: string
    leastDeliveredNeighborhood: string
  }

  const result = await db.$queryRaw<AnalyticsResult[]>(
    Prisma.sql`
      WITH customer_data AS (
      SELECT 
        COUNT(DISTINCT u.id)::float as total_customers
      FROM "User" u
      WHERE u."storeId" = ${store.id} AND u.role = 'CUSTOMER'
    ),
    order_data AS (
      SELECT 
        fo.id,
        fo.amount::float as amount,
        a.neighborhood
      FROM "FoodOrder" fo
      LEFT JOIN "Address" a ON a."foodOrderId" = fo.id
      LEFT JOIN "OrderHistoryFoodOrder" ohfo ON fo.id = ohfo."foodOrderId"
      LEFT JOIN "OrderHistory" oh ON ohfo."orderHistoryId" = oh.id
      WHERE 
        fo."storeId" = ${store.id}
        AND oh.progress = 'DELIVERED'
    ),
    avg_ticket AS (
      SELECT 
        COALESCE(AVG(amount), 0)::float as avg_ticket
      FROM order_data
    ),
    neighborhood_stats AS (
      SELECT 
        neighborhood,
        COUNT(*)::float as delivery_count
      FROM order_data
      WHERE neighborhood IS NOT NULL
      GROUP BY neighborhood
    ),
    most_delivered AS (
      SELECT 
        neighborhood as most_delivered_neighborhood
      FROM neighborhood_stats
      ORDER BY delivery_count DESC
      LIMIT 1
    ),
    least_delivered AS (
      SELECT 
        neighborhood as least_delivered_neighborhood
      FROM neighborhood_stats
      ORDER BY delivery_count ASC
      LIMIT 1
    )
    SELECT 
      (SELECT total_customers FROM customer_data)::float as "totalCustomers",
      (SELECT avg_ticket FROM avg_ticket)::float as "avgTicket",
      (SELECT most_delivered_neighborhood FROM most_delivered) as "mostDeliveredNeighborhood",
      (SELECT least_delivered_neighborhood FROM least_delivered) as "leastDeliveredNeighborhood"
    `
  )

  return c.json(
    {
      data: {
        ...result[0],
      },
    },
    200
  )
})

export default app
