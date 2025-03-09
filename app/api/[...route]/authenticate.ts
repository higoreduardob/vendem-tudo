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
  sendPasswordResetEmailWithSlug,
  sendTwoFactorTokenEmail,
  sendVerificationToken,
  sendVerificationTokenWithSlug,
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
  signUpSchema,
  updatePasswordSchema,
  updateSchema,
} from '@/features/auth/schema'
import { insertStoreSchema } from '@/features/stores/schema'

const app = new Hono()
  .post(
    '/sign-up',
    zValidator('query', z.object({ storeId: z.string().optional() })),
    zValidator('json', signUpSchema),
    async (c) => {
      const { storeId } = c.req.valid('query')
      const validatedFields = c.req.valid('json')

      if (!validatedFields) return c.json({ error: 'Campos inválidos' }, 400)

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

      switch (role) {
        case 'OWNER': {
          const existingUser = await db.user.findUnique({
            where: { unique_email_per_role: { email, role } },
          })
          if (existingUser) return c.json({ error: 'Email já cadastrado' }, 400)

          // TODO: Add paywall
          break
        }

        default: {
          if (!storeId) {
            return c.json({ error: 'Identificador não encontrado' }, 400)
          }

          const store = await db.store.findUnique({ where: { id: storeId } })
          if (!store) {
            return c.json({ error: 'Loja não cadastrada' }, 404)
          }

          const existingUser = await db.user.findUnique({
            where: { unique_email_per_store: { email, storeId } },
          })
          if (existingUser) return c.json({ error: 'Email já cadastrado' }, 400)

          break
        }
      }

      const store =
        role !== 'OWNER'
          ? storeId
            ? await db.store.findUnique({ where: { id: storeId } })
            : null
          : null

      if (role !== 'OWNER' && !store) {
        return c.json({ error: 'Loja não cadastrada' }, 404)
      }

      const hashedPassword = await bcrypt.hash(password, 10)
      await db.user.create({
        data: {
          ...values,
          email,
          password: hashedPassword,
          hasAcceptedTerms,
          role,
          storeId: role !== 'OWNER' ? storeId : null,
          ownerId: role !== 'OWNER' ? store?.ownerId : null,
          address: { create: { ...address } },
        },
      })

      const verificationToken = await generateVerificationToken(email)

      if (role === 'OWNER') {
        await sendVerificationToken(
          verificationToken.email,
          verificationToken.token,
          role
        )
      } else {
        const store = await db.store.findUnique({ where: { id: storeId } })
        if (!store) {
          return c.json({ error: 'Loja não cadastrada' }, 404)
        }

        await sendVerificationTokenWithSlug(
          verificationToken.email,
          verificationToken.token,
          role,
          store.slug,
          store.id
        )
      }

      return c.json(
        { success: 'Acesse seu email e confirme seu cadastro!' },
        201
      )
    }
  )
  .post(
    '/sign-up-verified',
    zValidator(
      'query',
      z.object({
        token: z.string().optional(),
        role: z.nativeEnum(UserRole).optional(),
        storeId: z.string().optional(),
      })
    ),
    async (c) => {
      const { token, role, storeId } = c.req.valid('query')

      if (!token || !role) return c.json({ error: 'Usuário inválido' }, 400)

      const existingUserToken = await db.verificationToken.findUnique({
        where: { token },
      })
      if (!existingUserToken)
        return c.json({ error: 'Usuário não cadastrado' }, 404)

      const hasExpired = new Date(existingUserToken.expires) < new Date()
      if (hasExpired) {
        return c.json({ error: 'Token expirado, faça novamente o login' }, 400)
      }

      switch (role) {
        case 'OWNER': {
          const existingUser = await db.user.findUnique({
            where: {
              unique_email_per_role: { email: existingUserToken.email, role },
            },
          })
          if (!existingUser) {
            return c.json({ error: 'Usuário não cadastrado' }, 404)
          }

          await db.user.update({
            where: { email: existingUser.email, id: existingUser.id },
            data: {
              emailVerified: new Date(),
              completedAccount: new Date(),
            },
          })

          await db.verificationToken.delete({
            where: { id: existingUserToken.id, token: existingUserToken.token },
          })

          const verificationToken = await generateVerificationToken(
            existingUserToken.email
          )

          return c.json(
            {
              success: 'Conta verificada, registre sua loja',
              token: verificationToken.token,
            },
            200
          )
        }

        default: {
          if (!storeId) {
            return c.json({ error: 'Identificador não encontrado' }, 400)
          }

          const store = await db.store.findUnique({ where: { id: storeId } })
          if (!store) {
            return c.json({ error: 'Loja não cadastrada' }, 404)
          }

          const existingUser = await db.user.findUnique({
            where: {
              unique_email_per_store: {
                email: existingUserToken.email,
                storeId,
              },
            },
          })
          if (!existingUser) {
            return c.json({ error: 'Usuário não cadastrado' }, 404)
          }

          await db.user.update({
            where: { email: existingUser.email, id: existingUser.id },
            data: {
              emailVerified: new Date(),
              completedAccount: new Date(),
            },
          })

          await db.verificationToken.delete({
            where: { id: existingUserToken.id, token: existingUserToken.token },
          })

          return c.json({ success: 'Conta verificada' }, 200)
        }
      }
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

    const user = await db.user.findUnique({
      where: { id: auth.token.sub },
    })
    if (!user) return c.json({ error: 'Usuário não autorizado' }, 401)

    return c.json({ success: !!user })
  })
  .post(
    '/sign-in',
    zValidator(
      'query',
      z.object({
        role: z.nativeEnum(UserRole).optional(),
        storeId: z.string().optional(),
      })
    ),
    zValidator('json', signInSchema),
    async (c) => {
      const { role, storeId } = c.req.valid('query')
      const validatedFields = c.req.valid('json')

      if (!role) return c.json({ error: 'Usuário inválido' }, 400)

      if (role !== 'OWNER' && !storeId) {
        return c.json({ error: 'Identificador não encontrado' }, 400)
      }

      if (!validatedFields) return c.json({ error: 'Campos inválidos' }, 400)
      const { email, password, code } = validatedFields

      const store =
        role !== 'OWNER'
          ? await db.store.findUnique({ where: { id: storeId } })
          : null
      if (role !== 'OWNER' && !store) {
        return c.json({ error: 'Loja não cadastrada' }, 404)
      }

      const existingUser =
        role === 'OWNER'
          ? await db.user.findUnique({
              where: {
                unique_email_per_role: { email, role },
              },
            })
          : storeId
          ? await db.user.findUnique({
              where: {
                unique_email_per_store: {
                  email,
                  storeId,
                },
              },
            })
          : null
      if (!existingUser || !existingUser.email || !existingUser.password) {
        return c.json({ error: 'Email não cadastrado' }, 400)
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

        if (role !== 'CUSTOMER') {
          await sendVerificationToken(
            verificationToken.email,
            verificationToken.token,
            role
          )
        } else if (!store) {
          return c.json({ error: 'Loja não cadastrada' }, 404)
        } else {
          await sendVerificationTokenWithSlug(
            verificationToken.email,
            verificationToken.token,
            role,
            store.slug,
            store.id
          )
        }

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

      if (
        existingUser.role === UserRole.OWNER &&
        !existingUser.completedStore
      ) {
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
          const twoFactorToken = await generateTwoFactorToken(
            existingUser.email
          )
          await sendTwoFactorTokenEmail(
            twoFactorToken.email,
            twoFactorToken.token
          )

          return c.json(
            {
              success: 'Informe o código enviado ao seu email',
              twoFactor: true,
            },
            200
          )
        }
      }

      try {
        await signIn('credentials', {
          email,
          password,
          role,
          storeId,
          redirect: false,
        })

        return c.json(
          {
            success: 'Login realizado com sucesso',
            redirect:
              role === 'CUSTOMER' && store
                ? `/loja/${store.slug}/conta`
                : DEFAULT_LOGIN_REDIRECT,
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
    }
  )
  .post(
    '/forgot-password',
    zValidator(
      'query',
      z.object({
        role: z.nativeEnum(UserRole).optional(),
        storeId: z.string().optional(),
      })
    ),
    zValidator('json', forgotPasswordSchema),
    async (c) => {
      const { role, storeId } = c.req.valid('query')
      const validatedFields = c.req.valid('json')

      if (!role) return c.json({ error: 'Usuário inválido' }, 400)

      if (role !== 'OWNER' && !storeId) {
        return c.json({ error: 'Identificador não encontrado' }, 400)
      }

      if (!validatedFields) return c.json({ error: 'Campos inválidos' }, 400)
      const { email } = validatedFields

      const existingUser =
        role === 'OWNER'
          ? await db.user.findUnique({
              where: {
                unique_email_per_role: { email, role },
              },
            })
          : storeId
          ? await db.user.findUnique({
              where: {
                unique_email_per_store: {
                  email,
                  storeId,
                },
              },
            })
          : null
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

      if (role !== 'CUSTOMER') {
        await sendPasswordResetEmail(
          passwordResetToken.email,
          passwordResetToken.token
        )
      } else {
        if (!storeId) {
          return c.json({ error: 'Identificador não encontrado' }, 400)
        }

        const store = await db.store.findUnique({ where: { id: storeId } })
        if (!store) {
          return c.json({ error: 'Loja não cadastrada' }, 404)
        }

        await sendPasswordResetEmailWithSlug(
          passwordResetToken.email,
          passwordResetToken.token,
          store.slug,
          store.id
        )
      }

      return c.json(
        { success: 'Acesse seu email para redefinir sua senha' },
        200
      )
    }
  )
  .post(
    '/reset-password',
    zValidator('json', resetPasswordSchema),
    zValidator(
      'query',
      z.object({
        token: z.string().optional(),
        role: z.nativeEnum(UserRole).optional(),
        storeId: z.string().optional(),
      })
    ),
    async (c) => {
      const validatedFields = c.req.valid('json')
      const { token, role, storeId } = c.req.valid('query')

      if (!token) return c.json({ error: 'Token inválido' }, 400)

      if (!role) return c.json({ error: 'Usuário inválido' }, 400)

      if (role !== 'OWNER' && !storeId) {
        return c.json({ error: 'Identificador não encontrado' }, 400)
      }

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

      const existingUser =
        role === 'OWNER'
          ? await db.user.findUnique({
              where: {
                unique_email_per_role: { email: existingToken.email, role },
              },
            })
          : storeId
          ? await db.user.findUnique({
              where: {
                unique_email_per_store: {
                  email: existingToken.email,
                  storeId,
                },
              },
            })
          : null
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
  .patch(
    '/:id/update-password',
    verifyAuth(),
    zValidator('param', z.object({ id: z.string().optional() })),
    zValidator('json', updatePasswordSchema),
    async (c) => {
      const auth = c.get('authUser')
      const { id } = c.req.valid('param')
      const validatedFields = c.req.valid('json')

      if (!validatedFields) return c.json({ error: 'Campos inválidos' }, 400)
      const { password, newPassword, repeatPassword } = validatedFields

      if (newPassword !== repeatPassword)
        return c.json({ error: 'Senhas devem ser iguais' }, 400)

      if (!id) {
        return c.json({ error: 'Identificador não encontrado' }, 400)
      }

      if (!auth.token?.sub) {
        return c.json({ error: 'Usuário não autorizado' }, 401)
      }

      if (auth.token.sub !== id) {
        return c.json({ error: 'Usuário não autorizado' }, 401)
      }

      const user = await db.user.findUnique({
        where: { id: auth.token.sub },
      })
      if (!user) return c.json({ error: 'Usuário não autorizado' }, 401)

      if (!user.password) {
        return c.json({ error: 'Informações inválidas' }, 400)
      }

      const isConfirm = bcrypt.compareSync(password, user.password)
      if (!isConfirm) {
        return c.json({ error: 'Usuário não autorizado' }, 401)
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10)
      await db.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      })

      return c.json({ success: 'Senha alterada' }, 200)
    }
  )
  .patch(
    '/:id/update-2fa',
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

      if (auth.token.sub !== id) {
        return c.json({ error: 'Usuário não autorizado' }, 401)
      }

      const user = await db.user.findUnique({
        where: { id: auth.token.sub },
      })
      if (!user) return c.json({ error: 'Usuário não autorizado' }, 401)

      await db.user.update({
        where: { id: user.id },
        data: {
          isTwoFactorEnabled: !user.isTwoFactorEnabled,
        },
      })

      return c.json({ success: 'Autenticação de dois fatores atualizada' }, 200)
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

      if (auth.token.sub !== id) {
        return c.json({ error: 'Usuário não autorizado' }, 401)
      }

      const user = await db.user.findUnique({
        where: { id: auth.token.sub },
      })
      if (!user) return c.json({ error: 'Usuário não autorizado' }, 401)

      await db.user.update({
        where: { id: user.id },
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

      return c.json({ success: 'Dados pessoais atualizados' }, 200)
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

// .post(
//   '/sign-up-information',
//   zValidator('json', signUpInformationSchema),
//   zValidator(
//     'query',
//     z.object({
//       token: z.string().optional(),
//       role: z.nativeEnum(UserRole).optional(),
//     })
//   ),
//   async (c) => {
//     const { token, role } = c.req.valid('query')
//     const validatedFields = c.req.valid('json')

//     if (!token || !role) return c.json({ error: 'Usuário inválido' }, 400)

//     if (!validatedFields) return c.json({ error: 'Campos inválidos' }, 400)
//     const { address, ...values } = validatedFields

//     const existingUserToken = await db.verificationToken.findUnique({
//       where: { token },
//     })
//     if (!existingUserToken)
//       return c.json({ error: 'Usuário não cadastrado' }, 404)

//     const hasExpired = new Date(existingUserToken.expires) < new Date()
//     if (hasExpired) {
//       return c.json({ error: 'Token expirado' }, 400)
//     }

//     const existingUser = await db.user.findUnique({
//       where: { email: existingUserToken.email },
//     })
//     if (!existingUser) {
//       return c.json({ error: 'Usuário não cadastrado' }, 404)
//     }

//     await db.user.update({
//       where: { email: existingUser.email, id: existingUser.id },
//       data: {
//         ...values,
//         completedAccount: new Date(),
//         address: { create: { ...address } },
//       },
//     })

//     await db.verificationToken.delete({
//       where: { id: existingUserToken.id, token: existingUserToken.token },
//     })

//     if (existingUser.role === UserRole.OWNER) {
//       const verificationToken = await generateVerificationToken(
//         existingUser.email
//       )

//       return c.json(
//         {
//           success: 'Cadastro completado, registre sua loja',
//           token: verificationToken.token,
//         },
//         200
//       )
//     }

//     return c.json({ success: 'Cadastro completado' }, 200)
//   }
// )
