import { z } from 'zod'
import { Hono } from 'hono'
import { verifyAuth } from '@hono/auth-js'
import { createId } from '@paralleldrive/cuid2'
import { zValidator } from '@hono/zod-validator'

import { UserRole } from '@prisma/client'

import { db } from '@/lib/db'

import { insertStoreSchema } from '@/features/stores/schema'

const app = new Hono()
  .post('/', verifyAuth(), zValidator('json', insertStoreSchema), async (c) => {
    const auth = c.get('authUser')
    const validatedFields = c.req.valid('json')

    if (!validatedFields) return c.json({ error: 'Campos inválidos' }, 400)
    const { slug, address, schedules, shippings, ...values } = validatedFields

    if (!auth.token?.sub) {
      return c.json({ error: 'Usuário não autorizado' }, 401)
    }

    const user = await db.user.findUnique({ where: { id: auth.token.sub } })
    if (!user) return c.json({ error: 'Usuário não autorizado' }, 401)

    if (![UserRole.OWNER as string].includes(user.role)) {
      return c.json({ error: 'Usuário sem autorização' }, 400)
    }
    const ownerId = user.id

    const existingSlugPath = await db.store.findUnique({ where: { slug } })
    if (existingSlugPath) {
      return c.json({ error: 'Link já cadastrado' }, 400)
    }

    await db.$transaction(async (tx) => {
      const data = await db.store.create({
        data: {
          id: createId(),
          slug,
          ownerId,
          enabled: true,
          ...values,
          address: { create: { ...address } },
          schedules: { createMany: { data: schedules } },
          shippings: { createMany: { data: shippings } },
        },
      })

      await tx.user.update({
        where: { id: user.id },
        data: {
          completedStore: new Date(),
          selectedStore: data.id,
        },
      })
    })

    return c.json({ success: 'Loja criada' }, 201)
  })
  .get('/', verifyAuth(), async (c) => {
    const auth = c.get('authUser')

    if (!auth.token?.sub) {
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

    const data = await db.store.findMany({
      where: { ownerId },
    })

    return c.json({ data }, 200)
  })
  .get(
    '/slug',
    zValidator('query', z.object({ slug: z.string().optional() })),
    async (c) => {
      const { slug } = c.req.valid('query')

      if (!slug) {
        return c.json({ error: 'Identificador não encontrado' }, 400)
      }

      const data = await db.store.findUnique({
        where: { slug, status: true },
        include: {
          address: {
            select: {
              city: true,
              neighborhood: true,
              state: true,
              street: true,
              zipCode: true,
              complement: true,
              number: true,
            },
          },
          schedules: {
            select: {
              enabled: true,
              day: true,
              open: true,
              close: true,
            },
          },
          shippings: {
            select: {
              id: true,
              neighborhood: true,
              city: true,
              state: true,
              fee: true,
              deadlineAt: true,
              minimumAmount: true,
            },
          },
        },
      })

      if (!data) {
        return c.json({ error: 'Loja não cadastrada' }, 404)
      }

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

      const data = await db.store.findUnique({
        where: { id, ownerId },
        include: {
          address: {
            select: {
              city: true,
              neighborhood: true,
              state: true,
              street: true,
              zipCode: true,
              complement: true,
              number: true,
            },
          },
          schedules: {
            select: {
              enabled: true,
              day: true,
              open: true,
              close: true,
            },
          },
          shippings: {
            select: {
              neighborhood: true,
              city: true,
              state: true,
              fee: true,
              deadlineAt: true,
              minimumAmount: true,
            },
          },
        },
      })

      if (!data) {
        return c.json({ error: 'Loja não cadastrada' }, 404)
      }

      return c.json({ data }, 200)
    }
  )
  .patch(
    '/:id/selected',
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

      const data = await db.store.findFirst({
        where: {
          id,
          OR: [{ ownerId }, { users: { some: { id: user.id } } }],
        },
      })

      if (!data) {
        return c.json({ error: 'Loja não encontrada' }, 404)
      }

      await db.user.update({
        where: { id: user.id },
        data: { selectedStore: data.id },
      })

      return c.json({ message: 'Loja selecionada com sucesso' })
    }
  )
  .patch(
    '/:id',
    verifyAuth(),
    zValidator('param', z.object({ id: z.string().optional() })),
    zValidator('json', insertStoreSchema),
    async (c) => {
      const auth = c.get('authUser')
      const { id } = c.req.valid('param')
      const validatedFields = c.req.valid('json')

      if (!validatedFields) return c.json({ error: 'Campos inválidos' }, 400)
      const { slug, address, schedules, shippings, ...values } = validatedFields

      if (!id) {
        return c.json({ error: 'Identificador não encontrado' }, 400)
      }

      if (!auth.token?.sub) {
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

      const existingSlugPath = await db.store.findFirst({
        where: {
          slug,
          ownerId: { not: ownerId },
        },
      })
      if (existingSlugPath) {
        return c.json({ error: 'Link já cadastrado' }, 400)
      }

      const data = await db.store.update({
        where: { id, ownerId },
        data: {
          slug,
          ...values,
          address: {
            upsert: {
              create: { ...address },
              update: { ...address },
            },
          },
          schedules: {
            deleteMany: {},
            createMany: {
              data: schedules.map((schedule) => ({
                day: schedule.day,
                open: schedule.open,
                close: schedule.close,
                enabled: schedule.enabled,
              })),
            },
          },
          shippings: {
            deleteMany: {
              storeId: id,
              neighborhood: { notIn: shippings.map((s) => s.neighborhood) },
            },
            upsert: shippings.map((shipping) => ({
              where: {
                storeId_neighborhood: {
                  storeId: id,
                  neighborhood: shipping.neighborhood,
                },
              },
              update: {
                neighborhood: shipping.neighborhood,
                city: shipping.city,
                state: shipping.state,
                fee: shipping.fee,
                deadlineAt: shipping.deadlineAt,
                minimumAmount: shipping.minimumAmount,
              },
              create: { ...shipping },
            })),
          },
        },
      })

      if (!data) {
        return c.json({ error: 'Loja não cadastrada' }, 404)
      }

      return c.json({ success: 'Loja atualizada' }, 200)
    }
  )

export default app
