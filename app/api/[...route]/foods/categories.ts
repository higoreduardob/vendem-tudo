import { z } from 'zod'
import { Hono } from 'hono'
import { verifyAuth } from '@hono/auth-js'
import { createId } from '@paralleldrive/cuid2'
import { zValidator } from '@hono/zod-validator'

import { Prisma, UserRole } from '@prisma/client'

import { db } from '@/lib/db'
import { destroyImage } from '@/lib/cloudinary'

import { insertCategorySchema } from '@/features/foods/categories/schema'

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

    const data = await db.foodCategory.findMany({
      where: { storeId: store.id },
      include: { _count: { select: { foods: true } } },
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

    // TODO: Fix error in mostSold in empty sales
    type AnalyticsResult = {
      mostSoldCategory: string
      leastSoldCategory: string
    }

    const result = await db.$queryRaw<AnalyticsResult[]>(
      Prisma.sql`
      WITH category_sales AS (
        SELECT 
          fc.id,
          fc.name,
          COUNT(fi.id)::integer as count
        FROM "FoodCategory" fc
        LEFT JOIN "Food" f ON f."categoryId" = fc.id
        LEFT JOIN "FoodItem" fi ON fi."foodId" = f.id
        LEFT JOIN "FoodOrder" fo ON fi."orderId" = fo.id
        WHERE fc."storeId" = ${store.id}
        GROUP BY fc.id, fc.name
      ),
      most_sold_category AS (
        SELECT name
        FROM category_sales
        ORDER BY count DESC
        LIMIT 1
      ),
      least_sold_category AS (
        SELECT name
        FROM category_sales
        WHERE count > 0
        ORDER BY count ASC
        LIMIT 1
      )
      SELECT 
        (SELECT name FROM most_sold_category) as "mostSoldCategory",
        (SELECT name FROM least_sold_category) as "leastSoldCategory"
      `
    )

    const { mostSoldCategory, leastSoldCategory } = result[0]

    return c.json({ data: { mostSoldCategory, leastSoldCategory } }, 200)
  })
  .get(
    '/stores/:storeId',
    zValidator('param', z.object({ storeId: z.string().optional() })),
    async (c) => {
      const { storeId } = c.req.valid('param')

      if (!storeId) {
        return c.json({ error: 'Identificador não encontrado' }, 400)
      }

      const store = await db.store.findUnique({ where: { id: storeId } })
      if (!store) {
        return c.json({ error: 'Loja não cadastrada' }, 404)
      }

      const data = await db.foodCategory.findMany({
        where: { storeId: store.id },
        include: { _count: true },
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

      const data = await db.foodCategory.findUnique({
        where: { id, storeId: store.id },
      })

      if (!data) {
        return c.json({ error: 'Categoria não cadastrada' }, 404)
      }

      return c.json({ data }, 200)
    }
  )
  .post(
    '/',
    verifyAuth(),
    zValidator('json', insertCategorySchema),
    async (c) => {
      const auth = c.get('authUser')
      const validatedFields = c.req.valid('json')

      if (!validatedFields) return c.json({ error: 'Campos inválidos' }, 400)
      const { name, ...values } = validatedFields

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

      const existingCategory = await db.foodCategory.findUnique({
        where: { unique_name_storeId: { name, storeId: store.id } },
      })
      if (existingCategory) {
        return c.json({ error: 'Já existe categoria com este nome' }, 400)
      }

      await db.foodCategory.create({
        data: {
          id: createId(),
          name,
          storeId: store.id,
          ...values,
        },
      })

      return c.json({ success: 'Categoria criada' }, 201)
    }
  )
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

      await db.foodCategory.updateMany({
        where: { id: { in: ids }, storeId: store.id },
        data: { status: false },
      })

      return c.json({ success: 'Categorias bloqueadas' }, 200)
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

      const data = await db.foodCategory.update({
        where: { id, storeId: store.id },
        data: { status: true },
      })

      if (!data) {
        return c.json({ error: 'Categoria não cadastrada' }, 404)
      }

      return c.json({ success: 'Categoria desbloqueada' }, 200)
    }
  )
  .patch(
    '/:id',
    verifyAuth(),
    zValidator('param', z.object({ id: z.string().optional() })),
    zValidator('json', insertCategorySchema),
    async (c) => {
      const auth = c.get('authUser')
      const { id } = c.req.valid('param')
      const validatedFields = c.req.valid('json')

      if (!validatedFields) return c.json({ error: 'Campos inválidos' }, 400)
      const { name, image } = validatedFields

      if (!id) {
        return c.json({ error: 'Identificador não encontrado' }, 400)
      }

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

      const existingCategory = await db.foodCategory.findFirst({
        where: { name, storeId: store.id, NOT: { id } },
      })
      if (existingCategory) {
        return c.json({ error: 'Já existe categoria com este nome' }, 400)
      }

      const currentCategory = await db.foodCategory.findUnique({
        where: { id, storeId: store.id },
      })
      if (!currentCategory) {
        return c.json({ error: 'Categoria não cadastrada' }, 404)
      }

      if (image && image !== currentCategory.image) {
        if (currentCategory.image) {
          try {
            const urlParts = currentCategory.image.split('/')
            const publicIdWithExtension = urlParts[urlParts.length - 1]
            const fileName = publicIdWithExtension.split('.')[0]
            const oldPublicId = `food-categories/${fileName}`

            const destroyResult = await destroyImage(oldPublicId)
            if (destroyResult.result !== 'ok') {
              return c.json({ error: 'Falha ao remover imagem antiga' }, 400)
            }
          } catch (error) {
            return c.json({ error: 'Falha ao remover imagem antiga' }, 400)
          }
        }
      }

      await db.foodCategory.update({
        where: { id, storeId: store.id },
        data: { name, image },
      })

      return c.json({ success: 'Categoria atualizada' }, 200)
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

      const data = await db.foodCategory.update({
        where: { id, storeId: store.id },
        data: { status: false },
      })

      if (!data) {
        return c.json({ error: 'Categoria não cadastrada' }, 404)
      }

      return c.json({ success: 'Categoria bloqueada' }, 200)
    }
  )

export default app
