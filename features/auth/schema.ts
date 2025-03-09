import { z } from 'zod'

import { UserRole } from '@prisma/client'

import {
  addressDefaultValues,
  addressSchema,
  cpfCnpjSchema,
  passwordSchema,
  rgIeSchema,
  whatsAppSchema,
} from '@/features/common/schema'

export const signUpSchema = z
  .object({
    name: z
      .string({ message: 'Nome é obrigatório' })
      .min(1, { message: 'Nome é obrigatório' }),
    email: z.coerce
      .string({ message: 'Email é obrigatório' })
      .email({ message: 'Informe um email válido' }),
    password: passwordSchema,
    repeatPassword: z
      .string({ message: 'Repetir senha é obrigatório' })
      .min(1, { message: 'Repetir senha é obrigatório' }),
    whatsApp: whatsAppSchema,
    cpfCnpj: cpfCnpjSchema,
    address: addressSchema,
    role: z.nativeEnum(UserRole, { message: 'Privilégio é obrigatório' }),
    hasAcceptedTerms: z.boolean().refine((value) => value, {
      message: 'Os termos de uso devem ser aceitos',
    }),
  })
  .refine(
    (data) => {
      if (data.password !== data.repeatPassword) return false
      return true
    },
    {
      message: 'Repetir deve ser igual a senha',
      path: ['repeatPassword'],
    }
  )

export type SignUpFormValues = z.infer<typeof signUpSchema>

export const signUpDefaultValues: SignUpFormValues = {
  email: '',
  name: '',
  password: '',
  repeatPassword: '',
  whatsApp: '',
  cpfCnpj: '',
  address: addressDefaultValues,
  role: UserRole.CUSTOMER,
  hasAcceptedTerms: false,
}

export const signInSchema = z.object({
  email: z.coerce
    .string({ message: 'Email é obrigatório' })
    .email({ message: 'Informe um email válido' }),
  password: z
    .string({ message: 'Senha é obrigatório' })
    .min(1, { message: 'Senha é obrigatório' }),
  role: z.nativeEnum(UserRole, { message: 'Privilégio é obrigatório' }),
  code: z.string({ invalid_type_error: 'Informe um código válido' }).nullish(),
  storeId: z.string().nullish(),
})

export type SignInFormValues = z.infer<typeof signInSchema>

export const signInDefaultValues: SignInFormValues = {
  email: '',
  password: '',
  role: UserRole.CUSTOMER,
  code: '',
  storeId: '',
}

export const signUpInformationSchema = z.object({
  rgIe: rgIeSchema,
  address: addressSchema,
})

export type SignUpInformationFormValues = z.infer<
  typeof signUpInformationSchema
>

export const signUpInformationDefaultValues: SignUpInformationFormValues = {
  rgIe: '',
  address: addressDefaultValues,
}

export const forgotPasswordSchema = z.object({
  email: z.coerce
    .string({ message: 'Email é obrigatório' })
    .email({ message: 'Informe um email válido' }),
})

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export const forgotPasswordDefaultValues: ForgotPasswordFormValues = {
  email: '',
}

export const resetPasswordSchema = z
  .object({
    password: z
      .string({ message: 'Senha é obrigatório' })
      .min(6, { message: 'Mínimo 6 caracteres' }),
    repeatPassword: z
      .string({ message: 'Repetir senha é obrigatório' })
      .min(1, { message: 'Repetir senha é obrigatório' }),
  })
  .refine(
    (data) => {
      if (data.password !== data.repeatPassword) return false
      return true
    },
    {
      message: 'Repetir deve ser igual a senha',
      path: ['repeatPassword'],
    }
  )

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>

export const resetPasswordDefaultValues: ResetPasswordFormValues = {
  password: '',
  repeatPassword: '',
}
