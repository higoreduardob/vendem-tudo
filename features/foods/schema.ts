import { z } from 'zod'

export const insertFoodSchema = z.object({
  name: z
    .string({ message: 'Nome é obrigatório' })
    .min(1, { message: 'Nome é obrigatório' }),
  image: z
    .string({ message: 'Imagem é obrigatório' })
    .min(1, { message: 'Imagem é obrigatório' }),
  description: z
    .string({ message: 'Descrição é obrigatório' })
    .min(1, { message: 'Descrição é obrigatório' }),
  ingredients: z.array(z.string({ message: 'Ingrediente é obrigatório' })),
  price: z.coerce.number({
    invalid_type_error: 'Preço é obrigatório',
  }),
  promotion: z.coerce
    .number({
      invalid_type_error: 'Valor promocional inválido',
    })
    .nullish(),
  categoryId: z
    .string({ message: 'Categoria é obrigatório' })
    .min(1, { message: 'Categoria é obrigatório' }),
  additionals: z.array(z.string()),
})

export const insertFoodFormSchema = insertFoodSchema.extend({
  price: z
    .string({ message: 'Preço é obrigatório' })
    .min(1, { message: 'Preço é obrigatório' }),
  promotion: z.string().nullish(),
})

export type InsertFoodFormValues = z.infer<typeof insertFoodFormSchema>

export const insertFoodDefaultValues: InsertFoodFormValues = {
  name: '',
  image: 'https://placehold.co/400',
  description: '',
  ingredients: [],
  price: '',
  promotion: '',
  categoryId: '',
  additionals: [],
}
