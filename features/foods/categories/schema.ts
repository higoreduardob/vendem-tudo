import { z } from 'zod'

export const insertCategorySchema = z.object({
  name: z
    .string({ message: 'Nome é obrigatório' })
    .min(1, { message: 'Nome é obrigatório' }),
  image: z
    .string({ message: 'Imagem é obrigatório' })
    .min(1, { message: 'Imagem é obrigatório' }),
})

export type InsertCategoryFormValues = z.infer<typeof insertCategorySchema>

// TODO: Change upload image
export const insertCategoryDefaultValues: InsertCategoryFormValues = {
  name: '',
  image: 'https://placehold.co/400',
}
