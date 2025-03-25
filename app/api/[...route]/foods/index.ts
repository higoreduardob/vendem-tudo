import { z } from 'zod'
import { Hono } from 'hono'
import { verifyAuth } from '@hono/auth-js'
import { createId } from '@paralleldrive/cuid2'
import { zValidator } from '@hono/zod-validator'

import { Prisma, UserRole } from '@prisma/client'

import { db } from '@/lib/db'
import { getAddedAndRemoved } from '@/lib/utils'

import { insertFoodSchema } from '@/features/foods/schema'

const app = new Hono()
  .get('/', verifyAuth(), async (c) => {
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

    const data = await db.food.findMany({
      where: { storeId: store.id },
      include: {
        category: { select: { name: true } },
      },
      orderBy: { name: 'asc' },
    })

    return c.json({ data }, 200)
  })
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

    // TODO: Fix error in mostSold and bestRated in empty sales
    type AnalyticsResult = {
      mostSoldProduct: string
      leastSoldProduct: string
      bestRatedProduct: string
      totalRevenue: number
    }

    const result = await db.$queryRaw<AnalyticsResult[]>(
      Prisma.sql`
      WITH food_sales AS (
        SELECT 
          f.id,
          f.name,
          COALESCE(f.sales, 0)::float as sales
        FROM "Food" f
        WHERE f."storeId" = ${store.id}
      ),
      most_sold AS (
        SELECT name
        FROM food_sales
        ORDER BY sales DESC
        LIMIT 1
      ),
      least_sold AS (
        SELECT name
        FROM food_sales
        WHERE sales > 0
        ORDER BY sales ASC
        LIMIT 1
      ),
      best_rated AS (
        SELECT name
        FROM "Food" f
        WHERE f."storeId" = ${store.id}
        ORDER BY 
          COALESCE(f."reviewsAvg", 0) DESC,
          COALESCE(f."reviewsAmount", 0) DESC
        LIMIT 1
      ),
      total_revenue AS (
        SELECT 
          COALESCE(SUM(fo.amount), 0)::float as total
        FROM "FoodOrder" fo
        WHERE fo."storeId" = ${store.id}
      )
      SELECT 
        (SELECT name FROM most_sold) as "mostSoldProduct",
        (SELECT name FROM least_sold) as "leastSoldProduct",
        (SELECT name FROM best_rated) as "bestRatedProduct",
        (SELECT total FROM total_revenue) as "totalRevenue"
      `
    )

    const {
      mostSoldProduct,
      leastSoldProduct,
      bestRatedProduct,
      totalRevenue,
    } = result[0]

    return c.json(
      {
        data: {
          mostSoldProduct,
          leastSoldProduct,
          bestRatedProduct,
          totalRevenue,
        },
      },
      200
    )
  })
  .get(
    '/stores/:storeId',
    zValidator('param', z.object({ storeId: z.string().optional() })),
    zValidator(
      'query',
      z.object({
        categoryId: z.string().optional(),
        search: z.string().optional(),
      })
    ),
    async (c) => {
      const { storeId } = c.req.valid('param')
      const { categoryId, search } = c.req.valid('query')

      if (!storeId) {
        return c.json({ error: 'Identificador não encontrado' }, 400)
      }

      const store = await db.store.findUnique({ where: { id: storeId } })
      if (!store) {
        return c.json({ error: 'Loja não cadastrada' }, 404)
      }

      const filters: Prisma.FoodWhereInput[] = []

      if (categoryId) {
        filters.push({ categoryId })
      }

      if (search) {
        filters.push({
          OR: [
            { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
            {
              description: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
            { ingredients: { hasSome: [search] } },
          ],
        })
      }

      const data = await db.food.findMany({
        where: {
          storeId: store.id,
          OR: filters.length > 0 ? filters : undefined,
        },
        include: {
          additionals: {
            select: {
              foodAdditional: {
                include: { options: { include: { foodOption: true } } },
              },
            },
          },
        },
      })

      return c.json({ data }, 200)
    }
  )
  .get(
    '/:id',
    verifyAuth(),
    zValidator('param', z.object({ id: z.string().optional() })),
    async (c) => {
      const auth = c.get('authUser')
      const { id } = c.req.valid('param')

      if (!id) {
        return c.json({ error: 'Identificador não encontrado' }, 400)
      }

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

      const data = await db.food.findUnique({
        where: { id, storeId: store.id },
        include: { additionals: { select: { foodAdditionalId: true } } },
      })

      if (!data) {
        return c.json({ error: 'Produto não cadastrado' }, 404)
      }

      return c.json({ data }, 200)
    }
  )
  .post('/', verifyAuth(), zValidator('json', insertFoodSchema), async (c) => {
    const auth = c.get('authUser')
    const validatedFields = c.req.valid('json')

    if (!validatedFields) return c.json({ error: 'Campos inválidos' }, 400)
    const { additionals, ...values } = validatedFields

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

    await db.food.create({
      data: {
        id: createId(),
        storeId: store.id,
        additionals: {
          createMany: {
            data: additionals.map((additional) => ({
              foodAdditionalId: additional,
            })),
          },
        },
        ...values,
      },
    })

    // TODO: Fix error in update enabled store in new owners
    // await db.store.update({
    //   where: { id: store.id, ownerId, enabled: false },
    //   data: { enabled: true },
    // })

    return c.json({ success: 'Produto criado' }, 201)
  })
  .post(
    '/bulk-delete',
    verifyAuth(),
    zValidator('json', z.object({ ids: z.array(z.string()) })),
    async (c) => {
      const auth = c.get('authUser')
      const { ids } = c.req.valid('json')

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

      await db.food.updateMany({
        where: { id: { in: ids }, storeId: store.id },
        data: { status: false },
      })

      return c.json({ success: 'Produtos bloqueados' }, 200)
    }
  )
  .patch(
    '/:id/undelete',
    verifyAuth(),
    zValidator('param', z.object({ id: z.string().optional() })),
    async (c) => {
      const auth = c.get('authUser')
      const { id } = c.req.valid('param')

      if (!id) {
        return c.json({ error: 'Identificador não encontrado' }, 400)
      }

      if (!auth.token?.sub) {
        return c.json({ error: 'Usuário não autorizado' }, 401)
      }

      if (!auth.token?.selectedStore) {
        return c.json({ error: 'Usuário não autorizado' }, 401)
      }

      const user = await db.user.findUnique({ where: { id: auth.token.sub } })
      if (!user) return c.json({ error: 'Usuário não autorizado' }, 401)

      if (user.role === UserRole.EMPLOYEE)
        return c.json({ error: 'Usuário não autorizado' }, 401)

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

      const data = await db.food.update({
        where: { id, storeId: store.id },
        data: { status: true },
      })

      if (!data) {
        return c.json({ error: 'Produto não cadastrado' }, 404)
      }

      return c.json({ success: 'Produto desbloqueado' }, 200)
    }
  )
  .patch(
    '/:id',
    verifyAuth(),
    zValidator('param', z.object({ id: z.string().optional() })),
    zValidator('json', insertFoodSchema),
    async (c) => {
      const auth = c.get('authUser')
      const { id } = c.req.valid('param')
      const validatedFields = c.req.valid('json')

      if (!validatedFields) return c.json({ error: 'Campos inválidos' }, 400)
      const { additionals, ...values } = validatedFields

      if (!id) {
        return c.json({ error: 'Identificador não encontrado' }, 400)
      }

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

      const currAdditionals = await db.food.findUnique({
        where: { id, storeId: store.id },
        select: { additionals: { select: { foodAdditionalId: true } } },
      })
      const currValues = currAdditionals?.additionals.map(
        (additional) => additional.foodAdditionalId
      )

      const { toAdd, toRemove } = await getAddedAndRemoved(
        currValues,
        additionals
      )

      const data = await db.food.update({
        where: { id, storeId: store.id },
        data: {
          ...values,
          additionals: {
            deleteMany: { foodAdditionalId: { in: toRemove || [] } },
            createMany: {
              data:
                toAdd.map((foodAdditionalId) => ({
                  foodAdditionalId,
                })) || [],
            },
          },
        },
      })

      if (!data) {
        return c.json({ error: 'Produto não cadastrado' }, 404)
      }

      return c.json({ success: 'Produto atualizado' }, 200)
    }
  )
  .delete(
    '/:id',
    verifyAuth(),
    zValidator('param', z.object({ id: z.string().optional() })),
    async (c) => {
      const auth = c.get('authUser')
      const { id } = c.req.valid('param')

      if (!id) {
        return c.json({ error: 'Identificador não encontrado' }, 400)
      }

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

      const data = await db.food.update({
        where: { id, storeId: store.id },
        data: { status: false },
      })

      if (!data) {
        return c.json({ error: 'Produto não cadastrado' }, 404)
      }

      return c.json({ success: 'Produto bloqueado' }, 200)
    }
  )

export default app
