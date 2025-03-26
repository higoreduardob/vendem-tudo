import { z } from 'zod'

import { allowedMimeTypes, maxImageSize } from '@/constants'

export const insertCategorySchema = z.object({
  name: z
    .string({ message: 'Nome é obrigatório' })
    .min(1, { message: 'Nome é obrigatório' }),
  image: z
    .string({ message: 'Imagem é obrigatório' })
    .min(1, { message: 'Imagem é obrigatório' }),
})

export const insertCategoryFormSchema = insertCategorySchema.extend({
  image: z
    .union([
      z
        .instanceof(File)
        .refine(
          (file) => file.size <= maxImageSize,
          'Imagem muito pesada (máx 512kB)'
        )
        .refine(
          (file) => allowedMimeTypes.includes(file.type),
          'Tipo de arquivo não suportado'
        ),
      z.string().min(1, { message: 'Imagem é obrigatório' }),
      z.null(),
    ])
    .refine((val) => val !== null, 'Imagem é obrigatório'),
})

export type InsertCategoryFormValues = z.infer<typeof insertCategoryFormSchema>

export const insertCategoryDefaultValues: InsertCategoryFormValues = {
  name: '',
  image: '',
}
