import { z } from 'zod'
import { Hono } from 'hono'
import { verifyAuth } from '@hono/auth-js'
import { createId } from '@paralleldrive/cuid2'
import { zValidator } from '@hono/zod-validator'

import { UserRole } from '@prisma/client'

import { db } from '@/lib/db'
import { getAddedAndRemoved } from '@/lib/utils'

import { insertAdditionalSchema } from '@/features/foods/additionals/schema'

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

    const ownerId = user.role === UserRole.OWNER ? user.id : user.ownerId!

    const store = await db.store.findUnique({
      where: { id: auth.token.selectedStore, ownerId },
    })

    if (!store) {
      return c.json({ error: 'Usuário não autorizado' }, 401)
    }

    const data = await db.foodAdditional.findMany({
      where: { storeId: store.id },
    })

    return c.json({ data }, 200)
  })
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

      const ownerId = user.role === UserRole.OWNER ? user.id : user.ownerId!

      const store = await db.store.findUnique({
        where: { id: auth.token.selectedStore, ownerId },
      })

      if (!store) {
        return c.json({ error: 'Usuário não autorizado' }, 401)
      }

      const data = await db.foodAdditional.findUnique({
        where: { id, storeId: store.id },
        include: { options: { select: { foodOptionId: true } } },
      })

      if (!data) {
        return c.json({ error: 'Adicional não cadastrado' }, 404)
      }

      return c.json({ data }, 200)
    }
  )
  .post(
    '/',
    verifyAuth(),
    zValidator('json', insertAdditionalSchema),
    async (c) => {
      const auth = c.get('authUser')
      const validatedFields = c.req.valid('json')

      if (!validatedFields) return c.json({ error: 'Campos inválidos' }, 400)
      const { options, ...values } = validatedFields

      if (!auth.token?.sub) {
        return c.json({ error: 'Usuário não autorizado' }, 401)
      }

      if (!auth.token?.selectedStore) {
        return c.json({ error: 'Usuário não autorizado' }, 401)
      }

      const user = await db.user.findUnique({ where: { id: auth.token.sub } })
      if (!user) return c.json({ error: 'Usuário não autorizado' }, 401)

      const ownerId = user.role === UserRole.OWNER ? user.id : user.ownerId!

      const store = await db.store.findUnique({
        where: { id: auth.token.selectedStore, ownerId },
      })

      if (!store) {
        return c.json({ error: 'Usuário não autorizado' }, 401)
      }

      await db.foodAdditional.create({
        data: {
          id: createId(),
          storeId: store.id,
          options: {
            createMany: {
              data: options.map((option) => ({ foodOptionId: option })),
            },
          },
          ...values,
        },
      })

      return c.json({ success: 'Adicional criado' }, 201)
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

      const ownerId = user.role === UserRole.OWNER ? user.id : user.ownerId!

      const store = await db.store.findUnique({
        where: { id: auth.token.selectedStore, ownerId },
      })

      if (!store) {
        return c.json({ error: 'Usuário não autorizado' }, 401)
      }

      await db.foodAdditional.updateMany({
        where: { id: { in: ids }, storeId: store.id },
        data: { status: false },
      })

      return c.json({ success: 'Adicionais bloqueados' }, 200)
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

      const ownerId = user.role === UserRole.OWNER ? user.id : user.ownerId!

      const store = await db.store.findUnique({
        where: { id: auth.token.selectedStore, ownerId },
      })

      if (!store) {
        return c.json({ error: 'Usuário não autorizado' }, 401)
      }

      const data = await db.foodAdditional.update({
        where: { id, storeId: store.id },
        data: { status: true },
      })

      if (!data) {
        return c.json({ error: 'Adicional não cadastrado' }, 404)
      }

      return c.json({ success: 'Adicional desbloqueado' }, 200)
    }
  )
  .patch(
    '/:id',
    verifyAuth(),
    zValidator('param', z.object({ id: z.string().optional() })),
    zValidator('json', insertAdditionalSchema),
    async (c) => {
      const auth = c.get('authUser')
      const { id } = c.req.valid('param')
      const validatedFields = c.req.valid('json')

      if (!validatedFields) return c.json({ error: 'Campos inválidos' }, 400)
      const { options, ...values } = validatedFields

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

      const ownerId = user.role === UserRole.OWNER ? user.id : user.ownerId!

      const store = await db.store.findUnique({
        where: { id: auth.token.selectedStore, ownerId },
      })

      if (!store) {
        return c.json({ error: 'Usuário não autorizado' }, 401)
      }

      const currAdditionals = await db.foodAdditional.findUnique({
        where: { id, storeId: store.id },
        select: { options: { select: { foodOptionId: true } } },
      })
      const currValues = currAdditionals?.options.map(
        (optional) => optional.foodOptionId
      )

      const { toAdd, toRemove } = await getAddedAndRemoved(currValues, options)

      const data = await db.foodAdditional.update({
        where: { id, storeId: store.id },
        data: {
          ...values,
          options: {
            deleteMany: { foodOptionId: { in: toRemove || [] } },
            createMany: {
              data:
                toAdd.map((foodOptionId) => ({
                  foodOptionId,
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

      const ownerId = user.role === UserRole.OWNER ? user.id : user.ownerId!

      const store = await db.store.findUnique({
        where: { id: auth.token.selectedStore, ownerId },
      })

      if (!store) {
        return c.json({ error: 'Usuário não autorizado' }, 401)
      }

      const data = await db.foodAdditional.update({
        where: { id, storeId: store.id },
        data: { status: false },
      })

      if (!data) {
        return c.json({ error: 'Adicional não cadastrado' }, 404)
      }

      return c.json({ success: 'Adicional bloqueado' }, 200)
    }
  )

export default app
