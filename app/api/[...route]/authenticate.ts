import { z } from 'zod'
import { Hono } from 'hono'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { AuthError } from 'next-auth'
import { verifyAuth } from '@hono/auth-js'
import { createId } from '@paralleldrive/cuid2'
import { zValidator } from '@hono/zod-validator'

import { UserRole } from '@prisma/client'

import {
  sendPasswordResetEmail,
  sendTwoFactorTokenEmail,
  sendVerificationToken,
} from '@/lib/mail'
import {
  generateTwoFactorToken,
  generateVerificationToken,
  getTwoFactorConfirmationByUserId,
  getTwoFactorTokenByEmail,
} from '@/lib/helpers'
import { db } from '@/lib/db'
import { signIn } from '@/auth'
import { DEFAULT_LOGIN_REDIRECT } from '@/constants'

import {
  forgotPasswordSchema,
  resetPasswordSchema,
  signInSchema,
  signUpInformationSchema,
  signUpSchema,
} from '@/features/auth/schema'
import { insertStoreSchema } from '@/features/stores/schema'

const app = new Hono()
  .post('/sign-up', zValidator('json', signUpSchema), async (c) => {
    const validatedFields = c.req.valid('json')

    if (!validatedFields) return c.json({ error: 'Campos inválidos' }, 400)

    const { email, password, repeatPassword, hasAcceptedTerms, ...values } =
      validatedFields
    const existingUser = await db.user.findUnique({ where: { email } })
    if (existingUser) return c.json({ error: 'Email já cadastrado' }, 400)

    if (!hasAcceptedTerms)
      return c.json({ error: 'Termos são obrigatórios' }, 400)

    if (password !== repeatPassword)
      return c.json({ error: 'Senhas devem ser iguais' }, 400)

    const hashedPassword = await bcrypt.hash(password, 10)
    await db.user.create({
      data: {
        ...values,
        email,
        password: hashedPassword,
        hasAcceptedTerms,
        role: UserRole.OWNER,
      },
    })

    // TODO: Add paywall
    const verificationToken = await generateVerificationToken(email)
    await sendVerificationToken(
      verificationToken.email,
      verificationToken.token
    )

    return c.json({ success: 'Acesse seu email e confirme seu cadastro!' }, 201)
  })
  .post(
    '/sign-up-verified',
    zValidator('query', z.object({ token: z.string().optional() })),
    async (c) => {
      const { token } = c.req.valid('query')

      if (!token) return c.json({ error: 'Usuário inválido' }, 400)

      const existingUserToken = await db.verificationToken.findUnique({
        where: { token },
      })
      if (!existingUserToken)
        return c.json({ error: 'Usuário não cadastrado' }, 404)

      const hasExpired = new Date(existingUserToken.expires) < new Date()
      if (hasExpired) {
        return c.json({ error: 'Token expirado, faça novamente o login' }, 400)
      }

      const existingUser = await db.user.findUnique({
        where: { email: existingUserToken.email },
      })
      if (!existingUser) {
        return c.json({ error: 'Usuário não cadastrado' }, 404)
      }

      await db.user.update({
        where: { email: existingUser.email, id: existingUser.id },
        data: {
          emailVerified: new Date(),
        },
      })

      await db.verificationToken.delete({
        where: { id: existingUserToken.id, token: existingUserToken.token },
      })

      return c.json({ success: 'Conta verificada' }, 200)
    }
  )
  .post(
    '/sign-up-information',
    zValidator('json', signUpInformationSchema),
    zValidator('query', z.object({ token: z.string().optional() })),
    async (c) => {
      const { token } = c.req.valid('query')
      const validatedFields = c.req.valid('json')

      if (!token) return c.json({ error: 'Usuário inválido' }, 400)

      if (!validatedFields) return c.json({ error: 'Campos inválidos' }, 400)
      const { address, ...values } = validatedFields

      const existingUserToken = await db.verificationToken.findUnique({
        where: { token },
      })
      if (!existingUserToken)
        return c.json({ error: 'Usuário não cadastrado' }, 404)

      const hasExpired = new Date(existingUserToken.expires) < new Date()
      if (hasExpired) {
        return c.json({ error: 'Token expirado' }, 400)
      }

      const existingUser = await db.user.findUnique({
        where: { email: existingUserToken.email },
      })
      if (!existingUser) {
        return c.json({ error: 'Usuário não cadastrado' }, 404)
      }

      await db.user.update({
        where: { email: existingUser.email, id: existingUser.id },
        data: {
          ...values,
          completedAccount: new Date(),
          address: { create: { ...address } },
        },
      })

      await db.verificationToken.delete({
        where: { id: existingUserToken.id, token: existingUserToken.token },
      })

      if (existingUser.role === UserRole.OWNER) {
        const verificationToken = await generateVerificationToken(
          existingUser.email
        )

        return c.json(
          {
            success: 'Cadastro completado, registre sua loja',
            token: verificationToken.token,
          },
          200
        )
      }

      return c.json({ success: 'Cadastro completado' }, 200)
    }
  )
  .post(
    '/sign-up-store',
    zValidator('json', insertStoreSchema),
    zValidator('query', z.object({ token: z.string().optional() })),
    async (c) => {
      const { token } = c.req.valid('query')
      const validatedFields = c.req.valid('json')

      if (!token) return c.json({ error: 'Usuário inválido' }, 400)

      if (!validatedFields) return c.json({ error: 'Campos inválidos' }, 400)
      const { slug, address, ...values } = validatedFields

      const existingUserToken = await db.verificationToken.findUnique({
        where: { token },
      })
      if (!existingUserToken)
        return c.json({ error: 'Usuário não cadastrado' }, 404)

      const hasExpired = new Date(existingUserToken.expires) < new Date()
      if (hasExpired) {
        return c.json({ error: 'Token expirado' }, 400)
      }

      const existingUser = await db.user.findUnique({
        where: { email: existingUserToken.email },
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
          },
        })

        await tx.user.update({
          where: { id: existingUser.id },
          data: {
            completedStore: new Date(),
            selectedStore: data.id,
          },
        })
      })

      await db.verificationToken.delete({
        where: { id: existingUserToken.id, token: existingUserToken.token },
      })

      return c.json({ success: 'Loja criada' }, 201)
    }
  )
  .post('/sign-in/validate', verifyAuth(), async (c) => {
    const auth = c.get('authUser')

    if (!auth.token?.sub) {
      return c.json({ error: 'Usuário não autorizado' }, 401)
    }

    const user = await db.user.findUnique({ where: { id: auth.token.sub } })
    if (!user) return c.json({ error: 'Usuário não autorizado' }, 401)

    return c.json({ success: !!user })
  })
  .post('/sign-in', zValidator('json', signInSchema), async (c) => {
    const validatedFields = c.req.valid('json')

    if (!validatedFields) return c.json({ error: 'Campos inválidos' }, 400)
    const { email, password, code } = validatedFields

    const existingUser = await db.user.findUnique({ where: { email } })
    if (!existingUser || !existingUser.email || !existingUser.password) {
      return c.json({ error: 'Email não cadastrado' }, 400)
    }

    if (
      ![UserRole.OWNER as string, UserRole.EMPLOYEE as string].includes(
        existingUser.role
      )
    ) {
      return c.json({ error: 'Usuário sem autorização' }, 400)
    }

    if (!code) {
      const passwordsMatch = await bcrypt.compare(
        password,
        existingUser.password
      )
      if (!passwordsMatch) {
        return c.json({ error: 'Email e/ou senha inválidos' }, 400)
      }
    }

    if (!existingUser.emailVerified) {
      const verificationToken = await generateVerificationToken(
        existingUser.email
      )
      await sendVerificationToken(
        verificationToken.email,
        verificationToken.token
      )

      return c.json(
        { success: 'Acesse seu email e confirme seu cadastro' },
        200
      )
    }

    if (!existingUser.completedAccount) {
      const verificationToken = await generateVerificationToken(
        existingUser.email
      )

      return c.json(
        {
          success: 'Complete seus dados cadastrais',
          redirect: `/cadastrar/completar-cadastro?token=${verificationToken.token}`,
        },
        200
      )
    }

    if (existingUser.role === UserRole.OWNER && !existingUser.completedStore) {
      const verificationToken = await generateVerificationToken(
        existingUser.email
      )

      return c.json(
        {
          success: 'Cadastre sua loja',
          redirect: `/cadastrar/loja?token=${verificationToken.token}`,
        },
        200
      )
    }

    if (existingUser.isTwoFactorEnabled && existingUser.email) {
      if (code) {
        const twoFactorToken = await getTwoFactorTokenByEmail(
          existingUser.email
        )
        if (!twoFactorToken) {
          return c.json({ error: 'Código inválido' }, 400)
        }

        if (twoFactorToken.token !== code) {
          return c.json({ error: 'Código inválido' }, 400)
        }

        const hasExpired = new Date(twoFactorToken.expires) < new Date()
        if (hasExpired) {
          return c.json({ error: 'Código expirado' }, 400)
        }

        await db.twoFactorToken.delete({
          where: { id: twoFactorToken.id },
        })

        const existingConfirmation = await getTwoFactorConfirmationByUserId(
          existingUser.id
        )
        if (existingConfirmation) {
          await db.twoFactorConfirmation.delete({
            where: { id: existingConfirmation.id },
          })
        }

        await db.twoFactorConfirmation.create({
          data: { userId: existingUser.id },
        })
      } else {
        const twoFactorToken = await generateTwoFactorToken(existingUser.email)
        await sendTwoFactorTokenEmail(
          twoFactorToken.email,
          twoFactorToken.token
        )

        return c.json(
          { success: 'Informe o código enviado ao seu email', twoFactor: true },
          200
        )
      }
    }

    try {
      await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      return c.json(
        {
          success: 'Login realizado com sucesso',
          redirect: DEFAULT_LOGIN_REDIRECT,
          update: true,
        },
        200
      )
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case 'CredentialsSignin':
            return c.json({ error: 'Email e/ou senha inválidos' }, 400)
          default:
            return c.json(
              { error: 'Erro inesperado, contate o administrador' },
              500
            )
        }
      }

      throw error
    }
  })
  .post(
    '/forgot-password',
    zValidator('json', forgotPasswordSchema),
    async (c) => {
      const validatedFields = c.req.valid('json')

      if (!validatedFields) return c.json({ error: 'Campos inválidos' }, 400)
      const { email } = validatedFields

      const existingUser = await db.user.findUnique({
        where: { email },
      })
      if (!existingUser) return c.json({ error: 'Usuário não cadastrado' }, 404)

      const token = uuidv4()
      const expires = new Date(new Date().getTime() + 3600 * 1000)
      const existingToken = await db.passwordResetToken.findFirst({
        where: { email },
      })

      if (existingToken) {
        await db.passwordResetToken.delete({
          where: { id: existingToken.id },
        })
      }

      const passwordResetToken = await db.passwordResetToken.create({
        data: {
          email,
          token,
          expires,
        },
      })
      await sendPasswordResetEmail(
        passwordResetToken.email,
        passwordResetToken.token
      )

      return c.json(
        { success: 'Acesse seu email para redefinir sua senha' },
        200
      )
    }
  )
  .post(
    '/reset-password',
    zValidator('json', resetPasswordSchema),
    zValidator('query', z.object({ token: z.string().optional() })),
    async (c) => {
      const validatedFields = c.req.valid('json')
      const { token } = c.req.valid('query')

      if (!token) return c.json({ error: 'Token inválido' }, 400)

      if (!validatedFields) return c.json({ error: 'Campos inválidos' }, 400)
      const { password, repeatPassword } = validatedFields

      if (password !== repeatPassword)
        return c.json({ error: 'Senhas devem ser iguais' }, 400)

      const existingToken = await db.passwordResetToken.findUnique({
        where: { token },
      })
      if (!existingToken) {
        return c.json({ error: 'Token inválido' }, 400)
      }

      const hasExpired = new Date(existingToken.expires) < new Date()
      if (hasExpired) {
        return c.json({ error: 'Token expirado' }, 400)
      }

      const existingUser = await db.user.findUnique({
        where: { email: existingToken.email },
      })
      if (!existingUser) {
        return c.json({ error: 'Usuário não cadastrado' }, 404)
      }

      const hashedPassword = await bcrypt.hash(password, 10)
      await db.user.update({
        where: { id: existingUser.id },
        data: { password: hashedPassword },
      })

      await db.passwordResetToken.delete({
        where: { id: existingToken.id },
      })

      return c.json({ success: 'Senha redefinida com sucesso' }, 200)
    }
  )
  .post(
    '/verify-recaptcha',
    zValidator(
      'json',
      z.object({
        recaptchaToken: z.string().optional(),
      })
    ),
    async (c) => {
      const { recaptchaToken } = c.req.valid('json')

      if (!recaptchaToken) {
        return c.json(
          { success: false, error: 'Token do reCAPTCHA não fornecido' },
          400
        )
      }

      const verifyCaptcha = async (token: string) => {
        const secretKey = process.env.RECAPTCHA_PRIVATE_KEY

        if (!secretKey) return c.json({ error: 'reCAPTCHA inválido' }, 400)

        const url = `https://www.google.com/recaptcha/api/siteverify`
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            secret: secretKey,
            response: token,
          }).toString(),
        })

        if (!response.ok) {
          throw new Error(
            `Erro ao verificar o reCAPTCHA: ${response.statusText}`
          )
        }

        const data = await response.json()
        return data.success
      }

      try {
        const isValid = await verifyCaptcha(recaptchaToken)

        if (!isValid) {
          return c.json({ error: 'Falha na validação do reCAPTCHA' }, 400)
        }

        return c.json({ success: 'reCAPTCHA validado com sucesso' }, 200)
      } catch (error) {
        return c.json(
          { error: 'Erro interno na verificação do reCAPTCHA' },
          500
        )
      }
    }
  )
  // TODO: Implement Recaptcha

export default app
