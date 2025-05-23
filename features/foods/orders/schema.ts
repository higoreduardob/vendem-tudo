import { z } from 'zod'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import {
  OrderHistoryProgress,
  ShippingRole,
  StorePayment,
} from '@prisma/client'

export const insertProductInCartSchema = z.object({
  productId: z
    .string({ message: 'Produto é obrigatório' })
    .min(1, { message: 'Produto é obrigatório' }),
  name: z
    .string({ message: 'Produto é obrigatório' })
    .min(1, { message: 'Produto é obrigatório' }),
  image: z.string(),
  // price: z.number().positive({ message: 'Preço é obrigatório' }),
  // promotion: z.number().nullish(),
  amount: z.number().positive({ message: 'Preço é obrigatório' }),
  subAmount: z.number().positive({ message: 'Subtotal é obrigatório' }),
  quantity: z.number().int().positive('A quantidade é obrigatório'),
  obs: z.string().nullish(),
  additionals: z.array(
    z.object({
      additionalId: z
        .string({ message: 'Adicional é obrigatório' })
        .min(1, { message: 'Adicional é obrigatório' }),
      name: z
        .string({ message: 'Adicional é obrigatório' })
        .min(1, { message: 'Adicional é obrigatório' }),
      options: z.array(
        z.object({
          optionId: z
            .string({ message: 'Opção é obrigatório' })
            .min(1, { message: 'Opção é obrigatório' }),
          name: z
            .string({ message: 'Opção é obrigatório' })
            .min(1, { message: 'Opção é obrigatório' }),
          quantity: z.number().int().positive('A quantidade é obrigatória'),
          price: z.number().positive({ message: 'Preço é obrigatório' }),
        })
      ),
    })
  ),
})

export type InsertProductInCartFormValues = z.infer<
  typeof insertProductInCartSchema
>

type CartState = {
  cart: InsertProductInCartFormValues[]
  addProduct: (product: InsertProductInCartFormValues) => void
  removeProduct: (productId: string) => void
  addCart: (index: number) => void
  removeCart: (index: number) => void
  clearCart: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: [],
      addProduct: (product) =>
        set((state) => {
          const parsedProduct = insertProductInCartSchema.safeParse(product)
          if (!parsedProduct.success) {
            console.error('Produto inválido:', parsedProduct.error.errors)
            return state
          }
          return { cart: [...state.cart, product] }
        }),
      removeProduct: (productId) =>
        set((state) => ({
          cart: state.cart.filter((product) => product.productId !== productId),
        })),
      addCart: (index) =>
        set((state) => ({
          cart: state.cart.map((item, key) =>
            key === index
              ? {
                  ...item,
                  quantity: item.quantity + 1,
                  subAmount: (item.quantity + 1) * item.amount,
                }
              : item
          ),
        })),
      removeCart: (index) =>
        set((state) => ({
          cart: state.cart
            .filter((_, key) => key !== index || state.cart[key].quantity > 1)
            .map((item, key) =>
              key === index
                ? {
                    ...item,
                    quantity: item.quantity - 1,
                    subAmount: (item.quantity - 1) * item.amount,
                  }
                : item
            ),
        })),
      clearCart: () => set({ cart: [] }),
    }),
    {
      name: 'cart-storage',
      storage: {
        getItem: (name) => {
          const item = localStorage.getItem(name)
          return item ? JSON.parse(item) : null
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value))
        },
        removeItem: (name) => {
          localStorage.removeItem(name)
        },
      },
    }
  )
)

export const insertOrderSchema = z.object({
  storeId: z
    .string({ message: 'Loja é obrigatório' })
    .min(1, { message: 'Loja é obrigatório' }),
  customerId: z
    .string({ message: 'Cliente é obrigatório' })
    .min(1, { message: 'Cliente é obrigatório' }),
  shippingId: z.string().nullish(),
  subAmount: z.number().positive({ message: 'Subtotal é obrigatório' }),
  amount: z.number().positive({ message: 'Total é obrigatório' }),
  fee: z.number().nullish(),
  deadlineAt: z.number().nullish(),
  shippingRole: z.nativeEnum(ShippingRole, {
    message: 'Método de entrega é obrigatório',
  }),
  items: z
    .array(insertProductInCartSchema)
    .min(1, { message: 'Pelo menos 1 item deve ser selecionado' }),
})

export type InsertOrderFormValues = z.infer<typeof insertOrderSchema>

export const insertCheckoutSchema = z
  .object({
    payment: z.nativeEnum(StorePayment, {
      message: 'Forma de pagamento é obrigatório',
    }),
    moneyChange: z.number().nullish(),
  })
  .merge(insertOrderSchema)
  .refine(
    (data) => {
      if (data.payment === StorePayment.CASH) {
        return (
          data.moneyChange &&
          data.moneyChange > 0 &&
          data.moneyChange >= data.amount
        )
      }
      return true
    },
    {
      message:
        'Troco é obrigatório e maior ou igual ao valor total, para pagamento em dinheiro',
      path: ['moneyChange'],
    }
  )

export type InsertCheckoutFormValues = z.infer<typeof insertCheckoutSchema>

export const updateHistorySchema = z.object({
  progress: z.nativeEnum(OrderHistoryProgress, {
    message: 'Situação é obrigatório',
  }),
})

export const insertReviewSchema = z.object({
  review: z
    .number({ message: 'Avaliação é obrigatório' })
    .positive({ message: 'Avaliação é obrigatório' }),
})

export type InsertReviewFormValues = z.infer<typeof insertReviewSchema>
