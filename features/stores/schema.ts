import { z } from 'zod'

import { ShippingRole, StorePayment, StoreRole } from '@prisma/client'

import {
  addressDefaultValues,
  addressSchema,
  cpfCnpjSchema,
  whatsAppSchema,
} from '@/features/common/schema'

export const insertScheduleSchema = z.object({
  enabled: z.boolean(),
  day: z.number().int(),
  open: z.coerce.date(),
  close: z.coerce.date(),
})

export const insertShippingSchema = z.object({
  neighborhood: z.string(),
  city: z.string(),
  state: z.string(),
  fee: z.number().int().nullish(),
  deadlineAt: z.number().int().nullish(),
  minimumAmount: z.number().int().nullish(),
})

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
  payment: z
    .array(z.nativeEnum(StorePayment), {
      message: 'forma de pagamento é obrigatório',
    })
    .min(1, {
      message: 'Pelo menos um tipo de forma de pagamento deve ser selecionado',
    }),
  shippingRole: z
    .array(z.nativeEnum(ShippingRole), {
      message: 'Método de entrega é obrigatório',
    })
    .min(1, {
      message: 'Pelo menos um método de entrega deve ser selecionado',
    }),
  schedules: z
    .array(insertScheduleSchema)
    .min(1, { message: 'Selecione pelo menos 1 horário de funcionamento' }),
  shippings: z
    .array(insertShippingSchema)
    .min(1, { message: 'Informe ao menos 1 endereço de entrega' }),
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
  payment: [],
  shippingRole: [],
  schedules: [],
  shippings: [],
  address: addressDefaultValues,
}
