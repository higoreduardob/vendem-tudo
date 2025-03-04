import { z } from 'zod'

export const insertFoodOptionSchema = z.object({
  name: z
    .string({ message: 'Nome é obrigatório' })
    .min(1, { message: 'Nome é obrigatório' }),
  description: z
    .string({ message: 'Descrição é obrigatório' })
    .min(1, { message: 'Descrição é obrigatório' }),
  price: z.coerce.number({
    invalid_type_error: 'Preço é obrigatório',
  }),
})

export const insertFoodOptionFormSchema = insertFoodOptionSchema.extend({
  price: z
    .string({ message: 'Preço é obrigatório' })
    .min(1, { message: 'Preço é obrigatório' }),
})

export type InsertFoodOptionFormValues = z.infer<
  typeof insertFoodOptionFormSchema
>

export const insertFoodOptionDefaultValues: InsertFoodOptionFormValues = {
  name: '',
  description: '',
  price: '',
}
