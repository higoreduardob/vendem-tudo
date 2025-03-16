import { z } from 'zod'
import { Hono } from 'hono'
import { verifyAuth } from '@hono/auth-js'
import { createId } from '@paralleldrive/cuid2'
import { zValidator } from '@hono/zod-validator'

import { UserRole } from '@prisma/client'

import { db } from '@/lib/db'

import {
  insertCheckoutSchema,
  updateHistorySchema,
} from '@/features/foods/orders/schema'

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
      where: { id: auth.token.selectedStore.id, ownerId },
    })

    if (!store) {
      return c.json({ error: 'Usuário não autorizado' }, 401)
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
        customer: {
          select: {
            name: true,
            whatsApp: true,
            email: true,
          },
        },
        items: {
          select: {
            id: true,
            reviewed: true,
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
    })

    return c.json({ data }, 200)
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

      const user = await db.user.findUnique({ where: { id: auth.token.sub } })
      if (!user) return c.json({ error: 'Usuário não autorizado' }, 401)

      if (![UserRole.CUSTOMER as string].includes(user.role)) {
        return c.json({ error: 'Usuário sem autorização' }, 400)
      }

      const store = await db.store.findUnique({
        where: { id: storeId },
        include: { shippings: true },
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
          code: 'code',
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
        },
      })

      return c.json({ success: 'Pedido realizado com sucesso' }, 201)
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
