import { z } from 'zod'
import { Hono } from 'hono'
import { verifyAuth } from '@hono/auth-js'
import { zValidator } from '@hono/zod-validator'

import { UserRole } from '@prisma/client'

import { db } from '@/lib/db'

const app = new Hono()
  .get('/', verifyAuth(), async (c) => {
    const auth = c.get('authUser')

    if (!auth.token?.sub) {
      return c.json({ error: 'Usuário não autorizado' }, 401)
    }

    const user = await db.user.findUnique({ where: { id: auth.token.sub } })
    if (!user) return c.json({ error: 'Usuário não autorizado' }, 401)

    if (![UserRole.OWNER as string].includes(user.role)) {
      return c.json({ error: 'Usuário sem autorização' }, 400)
    }
    const ownerId = user.id

    const data = await db.user.findMany({
      where: { ownerId, role: 'CUSTOMER' },
    })

    return c.json({ data }, 200)
  })
  .get('/stores', verifyAuth(), async (c) => {
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
      where: { id: auth.token.selectedStore.id, ownerId },
    })
    if (!store) {
      return c.json({ error: 'Usuário não autorizado' }, 401)
    }

    // TODO: Check role
    // if (![UserRole.OWNER as string].includes(user.role)) {
    //   return c.json({ error: 'Usuário sem autorização' }, 400)
    // }

    const users = await db.user.findMany({
      where: {
        ownerId,
        role: 'CUSTOMER',
        storeId: auth.token.selectedStore.id,
      },
      include: { address: true },
    })

    const data = users.map(({ password, ...rest }) => rest)

    return c.json({ data }, 200)
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

      const ownerId = user.role === UserRole.OWNER ? user.id : user.ownerId!

      const store = await db.store.findUnique({
        where: { id: auth.token.selectedStore.id, ownerId },
      })
      if (!store) {
        return c.json({ error: 'Usuário não autorizado' }, 401)
      }

      await db.user.updateMany({
        where: {
          id: { in: ids },
          storeId: store.id,
          ownerId,
          role: 'CUSTOMER',
        },
        data: { status: false },
      })

      return c.json({ success: 'Clientes bloqueados' }, 200)
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
        where: { id: auth.token.selectedStore.id, ownerId },
      })
      if (!store) {
        return c.json({ error: 'Usuário não autorizado' }, 401)
      }

      const data = await db.user.update({
        where: { id, storeId: store.id, ownerId, role: 'CUSTOMER' },
        data: { status: false },
      })

      if (!data) {
        return c.json({ error: 'Cliente não cadastrado' }, 404)
      }

      return c.json({ success: 'Cliente bloqueado' }, 200)
    }
  )

export default app
