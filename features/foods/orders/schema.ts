import { z } from 'zod'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const insertProductInCartSchema = z.object({
  productId: z
    .string({ message: 'Produto é obrigatório' })
    .min(1, { message: 'Produto é obrigatório' }),
  name: z
    .string({ message: 'Produto é obrigatório' })
    .min(1, { message: 'Produto é obrigatório' }),
  image: z.string(),
  amount: z.number().positive({ message: 'Preço é obrigatório' }),
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

// const existingProduct = state.cart.find(
//   (item) => item.productId === product.productId
// )
// if (existingProduct) {
//   return {
//     cart: state.cart.map((item) =>
//       item.productId === product.productId
//         ? { ...item, quantity: item.quantity + product.quantity }
//         : item
//     ),
//   }
// }

// export const insertCartSchema = z.object({
//   product:

// })

// export const insertOrderSchema = z.object({
//   cart: z
//     .array(z.object({

//     }))
//     .min(1, { message: 'Pelo menos um produto deve ser adicionado' }),
// })

// const OrderSchema = mongoose.Schema(
//   {
//     // store: {
//     //   type: mongoose.Schema.Types.ObjectId,
//     //   ref: 'Store',
//     //   required: [true, 'Loja é obrigatória'],
//     // },
//     // customer: {
//     //   type: mongoose.Schema.Types.ObjectId,
//     //   ref: 'Customer',
//     //   required: [true, 'Cliente é obrigatório'],
//     // },
//     // code: { type: String },
//     cart: {
//       type: [
//         {
//           cartId: {
//             type: String,
//             required: [true, 'Identificador do carrinho é obrigatório'],
//           },
//           product: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'Product',
//             required: [true, 'Produto é obrigatório'],
//           },
//           name: { type: String, required: [true, 'Nome é obrigatório'] },
//           stars: { type: Number, max: 5, default: 0 },
//           reviewd: { type: Boolean, default: false },
//           additional: {
//             type: [
//               {
//                 name: { type: String, required: [true, 'Nome é obrigatório'] },
//                 option: {
//                   type: [
//                     {
//                       name: {
//                         type: String,
//                         required: [true, 'Nome é obrigatório'],
//                       },
//                       quantity: { type: Number, default: 1 },
//                       price: {
//                         type: Number,
//                         required: [true, 'Preço é obrigatório'],
//                       },
//                     },
//                   ],
//                   default: [],
//                   _id: false,
//                 },
//               },
//             ],
//             default: [],
//             _id: false,
//           },
//           image: { type: String },
//           quantity: { type: Number, default: 1 },
//           price: {
//             type: Number,
//             required: [true, 'Valor unitário é obrigatório'],
//           },
//           obs: { type: String },
//         },
//       ],
//     },
//     shipping: {
//       type: {
//         method: {
//           type: String,
//           enum: shippingEnum,
//           required: [true, 'Método de entrega é obrigatório'],
//         },
//         neighborhood: String,
//         price: {
//           type: Number,
//           required: [true, 'Valor da entrega é obrigatório'],
//         },
//         deadlineAt: Number,
//         street: { type: String },
//         city: { type: String },
//         state: { type: String },
//         number: { type: String },
//         zipCode: { type: String },
//         complement: { type: String },
//       },
//       required: true,
//       _id: false,
//     },
//     payment: {
//       type: {
//         method: {
//           type: String,
//           required: [true, 'Método pagamento é obrigatório'],
//         },
//         amount: {
//           type: Number,
//           required: [true, 'Total pedido é obrigatório'],
//         },
//         moneyChange: { type: Number },
//         status: {
//           type: String,
//           enum: paymentStatusEnum,
//           required: [true, 'Status do pagamento é obrigatório'],
//           default: paymentStatusEnum.Pending,
//         },
//       },
//       required: true,
//       _id: false,
//     },
//     status: [
//       {
//         type: {
//           type: String,
//           enum: orderEnum,
//           required: [true, 'Status do pedido é obrigatório'],
//         },
//         dateTime: { type: Date, default: Date.now() },
//         _id: false,
//       },
//     ],
//   },
//   { timestamps: true }
// )
