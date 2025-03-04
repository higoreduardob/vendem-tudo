import { z } from 'zod'

import { StoreRole } from '@prisma/client'

import {
  addressDefaultValues,
  addressSchema,
  cpfCnpjSchema,
  whatsAppSchema,
} from '@/features/common/schema'

export const insertStoreSchema = z.object({
  name: z
    .string({ message: 'Nome é obrigatório' })
    .min(1, { message: 'Nome é obrigatório' }),
  slug: z
    .string({ message: 'Endereço único é obrigatório' })
    .min(1, { message: 'Endereço único é obrigatório' }),
  email: z.coerce
    .string({ message: 'Email é obrigatório' })
    .email({ message: 'Informe um email válido' })
    .nullish(),
  cpfCnpj: cpfCnpjSchema,
  whatsApp: whatsAppSchema,
  role: z
    .array(z.nativeEnum(StoreRole), {
      message: 'Tipo de produto é obrigatório',
    })
    .min(1, { message: 'Pelo menos um tipo deve ser selecionado' }),
  address: addressSchema,
})

export type InsertStoreFormValues = z.infer<typeof insertStoreSchema>

export const insertStoreDefaultValues: InsertStoreFormValues = {
  name: '',
  slug: '',
  email: '',
  cpfCnpj: '',
  whatsApp: '',
  role: [],
  address: addressDefaultValues,
}
