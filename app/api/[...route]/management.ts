import { z } from 'zod'
import { Hono } from 'hono'
import bcrypt from 'bcryptjs'
import { verifyAuth } from '@hono/auth-js'
import { createId } from '@paralleldrive/cuid2'
import { zValidator } from '@hono/zod-validator'

import { UserRole } from '@prisma/client'

import { db } from '@/lib/db'
import { sendPasswordSignInEmail } from '@/lib/mail'
import { generateVerificationToken } from '@/lib/helpers'

import { insertStoreSchema } from '@/features/stores/schema'
import { signUpSchema, updateSchema } from '@/features/auth/schema'

const app = new Hono()
  .post(
    '/sign-up',
    verifyAuth(),
    zValidator('json', signUpSchema),
    async (c) => {
      const auth = c.get('authUser')
      const validatedFields = c.req.valid('json')

      if (!auth.token?.sub) {
        return c.json({ error: 'Usuário não autorizado' }, 401)
      }

      if (!validatedFields) return c.json({ error: 'Campos inválidos' }, 400)

      const user = await db.user.findUnique({ where: { id: auth.token.sub } })
      if (!user) return c.json({ error: 'Usuário não autorizado' }, 401)

      if (![UserRole.ADMINISTRATOR as string].includes(user.role)) {
        return c.json({ error: 'Usuário sem autorização' }, 401)
      }

      const {
        email,
        password,
        repeatPassword,
        hasAcceptedTerms,
        role,
        address,
        ...values
      } = validatedFields

      if (!hasAcceptedTerms)
        return c.json({ error: 'Termos são obrigatórios' }, 400)

      if (password !== repeatPassword)
        return c.json({ error: 'Senhas devem ser iguais' }, 400)

      const existingUser = await db.user.findUnique({
        where: { unique_email_per_role: { email, role } },
      })
      if (existingUser) return c.json({ error: 'Email já cadastrado' }, 400)

      const hashedPassword = await bcrypt.hash(password, 10)
      await db.user.create({
        data: {
          ...values,
          email,
          password: hashedPassword,
          hasAcceptedTerms,
          role,
          address: { create: { ...address } },
        },
      })
      const verificationToken = await generateVerificationToken(email)

      return c.json(
        {
          success: 'Cadastre a loja do proprietário',
          token: verificationToken.token,
          password,
        },
        201
      )
    }
  )
  .post(
    '/sign-up-store',
    verifyAuth(),
    zValidator('json', insertStoreSchema),
    zValidator(
      'query',
      z.object({
        token: z.string().optional(),
        password: z.string().optional(),
      })
    ),
    async (c) => {
      const auth = c.get('authUser')
      const { token, password } = c.req.valid('query')
      const validatedFields = c.req.valid('json')

      if (!auth.token?.sub) {
        return c.json({ error: 'Usuário não autorizado' }, 401)
      }

      if (!token || !password) return c.json({ error: 'Usuário inválido' }, 400)

      if (!validatedFields) return c.json({ error: 'Campos inválidos' }, 400)
      const { slug, address, schedules, shippings, ...values } = validatedFields

      const user = await db.user.findUnique({ where: { id: auth.token.sub } })
      if (!user) return c.json({ error: 'Usuário não autorizado' }, 401)

      if (![UserRole.ADMINISTRATOR as string].includes(user.role)) {
        return c.json({ error: 'Usuário sem autorização' }, 401)
      }

      const existingUserToken = await db.verificationToken.findUnique({
        where: { token },
      })
      if (!existingUserToken)
        return c.json({ error: 'Usuário não cadastrado' }, 404)

      const hasExpired = new Date(existingUserToken.expires) < new Date()
      if (hasExpired) {
        return c.json({ error: 'Token expirado, faça o login novamente' }, 400)
      }

      const existingUser = await db.user.findUnique({
        where: {
          unique_email_per_role: {
            email: existingUserToken.email,
            role: 'OWNER',
          },
        },
      })
      if (!existingUser) {
        return c.json({ error: 'Usuário não cadastrado' }, 404)
      }

      const existingSlugPath = await db.store.findUnique({ where: { slug } })
      if (existingSlugPath) {
        return c.json({ error: 'Link já cadastrado' }, 400)
      }

      await db.$transaction(async (tx) => {
        const data = await tx.store.create({
          data: {
            id: createId(),
            ownerId: existingUser.id,
            slug,
            ...values,
            address: { create: { ...address } },
            schedules: { createMany: { data: schedules } },
            shippings: { createMany: { data: shippings } },
          },
        })

        await tx.user.update({
          where: { id: existingUser.id },
          data: {
            emailVerified: new Date(),
            completedAccount: new Date(),
            completedStore: new Date(),
            selectedStore: data.id,
          },
        })
      })

      await db.verificationToken.delete({
        where: { id: existingUserToken.id, token: existingUserToken.token },
      })

      await sendPasswordSignInEmail(existingUser.email, password)

      return c.json({ success: 'Loja criada' }, 201)
    }
  )
  .get(
    '/',
    verifyAuth(),
    zValidator(
      'query',
      z.object({
        role: z.nativeEnum(UserRole).optional(),
      })
    ),
    async (c) => {
      const auth = c.get('authUser')
      const { role } = c.req.valid('query')

      if (!auth.token?.sub) {
        return c.json({ error: 'Usuário não autorizado' }, 401)
      }

      const user = await db.user.findUnique({ where: { id: auth.token.sub } })
      if (!user) return c.json({ error: 'Usuário não autorizado' }, 401)

      if (![UserRole.ADMINISTRATOR as string].includes(user.role)) {
        return c.json({ error: 'Usuário sem autorização' }, 401)
      }

      const roles: UserRole[] = role
        ? [role]
        : ['OWNER', 'EMPLOYEE', 'MANAGER', 'CUSTOMER']

      const users = await db.user.findMany({
        where: {
          role: { in: roles },
        },
        include: { address: true },
      })
      const data = users.map(({ password, ...rest }) => rest)

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

      if (![UserRole.ADMINISTRATOR as string].includes(user.role)) {
        return c.json({ error: 'Usuário sem autorização' }, 401)
      }

      const data = await db.user.findUnique({
        where: { id },
        include: { address: true },
      })

      if (!data) {
        return c.json({ error: 'Usuário não cadastrado' }, 404)
      }

      const { password, ...rest } = data

      return c.json({ data: rest }, 200)
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

      const user = await db.user.findUnique({ where: { id: auth.token.sub } })
      if (!user) return c.json({ error: 'Usuário não autorizado' }, 401)

      if (![UserRole.ADMINISTRATOR as string].includes(user.role)) {
        return c.json({ error: 'Usuário sem autorização' }, 401)
      }

      await db.user.updateMany({
        where: {
          id: { in: ids },
        },
        data: { status: false },
      })

      return c.json({ success: 'Usuários bloqueados' }, 200)
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

      const user = await db.user.findUnique({ where: { id: auth.token.sub } })
      if (!user) return c.json({ error: 'Usuário não autorizado' }, 401)

      if (![UserRole.ADMINISTRATOR as string].includes(user.role)) {
        return c.json({ error: 'Usuário sem autorização' }, 401)
      }

      const data = await db.user.update({
        where: { id },
        data: { status: true },
      })

      if (!data) {
        return c.json({ error: 'Usuário não cadastrado' }, 404)
      }

      return c.json({ success: 'Usuário desbloqueado' }, 200)
    }
  )
  .patch(
    '/:id',
    verifyAuth(),
    zValidator('param', z.object({ id: z.string().optional() })),
    zValidator('json', updateSchema),
    async (c) => {
      const auth = c.get('authUser')
      const { id } = c.req.valid('param')
      const validatedFields = c.req.valid('json')

      if (!validatedFields) return c.json({ error: 'Campos inválidos' }, 400)
      const { address, ...values } = validatedFields

      if (!id) {
        return c.json({ error: 'Identificador não encontrado' }, 400)
      }

      if (!auth.token?.sub) {
        return c.json({ error: 'Usuário não autorizado' }, 401)
      }

      const user = await db.user.findUnique({ where: { id: auth.token.sub } })
      if (!user) return c.json({ error: 'Usuário não autorizado' }, 401)

      if (![UserRole.ADMINISTRATOR as string].includes(user.role)) {
        return c.json({ error: 'Usuário sem autorização' }, 401)
      }

      const data = await db.user.update({
        where: { id },
        data: {
          ...values,
          address: {
            upsert: {
              create: { ...address },
              update: { ...address },
            },
          },
        },
      })

      if (!data) {
        return c.json({ error: 'Usuário não cadastrado' }, 404)
      }

      return c.json({ success: 'Usuário atualizado' }, 200)
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

      const user = await db.user.findUnique({ where: { id: auth.token.sub } })
      if (!user) return c.json({ error: 'Usuário não autorizado' }, 401)

      if (![UserRole.ADMINISTRATOR as string].includes(user.role)) {
        return c.json({ error: 'Usuário sem autorização' }, 401)
      }

      const data = await db.user.update({
        where: { id },
        data: { status: false },
      })

      if (!data) {
        return c.json({ error: 'Usuário não cadastrado' }, 404)
      }

      return c.json({ success: 'Usuário bloqueado' }, 200)
    }
  )

export default app
