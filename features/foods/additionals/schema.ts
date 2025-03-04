import { z } from 'zod'

import { FoodAdditionalRole } from '@prisma/client'

export const insertAdditionalSchema = z.object({
  name: z
    .string({ message: 'Nome é obrigatório' })
    .min(1, { message: 'Nome é obrigatório' }),
  description: z
    .string({ message: 'Descrição é obrigatório' })
    .min(1, { message: 'Descrição é obrigatório' }),
  role: z.nativeEnum(FoodAdditionalRole, {
    message: 'Tipo do adicional é obrigatório',
  }),
  limit: z.coerce
    .number({
      invalid_type_error: 'Limite inválido',
    })
    .nullish(),
  required: z.boolean(),
  minRequired: z.coerce
    .number({
      invalid_type_error: 'Limite inválido',
    })
    .nullish(),
  options: z.array(z.string()).min(1, { message: 'Opcional é obrigatório' }),
})

export type InsertAdditionalFormValues = z.infer<typeof insertAdditionalSchema>

export const insertAdditionalDefaultValues: InsertAdditionalFormValues = {
  name: '',
  description: '',
  role: FoodAdditionalRole.UNIQUE,
  required: false,
  limit: null,
  minRequired: null,
  options: [],
}
