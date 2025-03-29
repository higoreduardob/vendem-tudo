'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { UserRole } from '@prisma/client'

import {
  forgotPasswordDefaultValues,
  ForgotPasswordFormValues,
  forgotPasswordSchema,
} from '@/features/auth/schema'

import { useForgotPassword } from '@/features/auth/api/use-forgot-password'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ButtonLoading } from '@/components/button-custom'
import { Wrapper } from '@/features/auth/components/wrapper'

export const FormForgotPassword = ({
  role,
  slug,
  storeId,
  isCustomer = false,
}: {
  role: UserRole
  slug?: string
  storeId?: string
  isCustomer?: boolean
}) => {
  const mutation = useForgotPassword(role, storeId)
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: forgotPasswordDefaultValues,
    shouldFocusError: true,
    reValidateMode: 'onChange',
    mode: 'all',
  })

  const isPending = mutation.isPending

  const onSubmit = (values: ForgotPasswordFormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        form.reset()
      },
    })
  }

  return (
    <Wrapper
      title="Recuperar senha"
      description="Informe o email da sua conta"
      footerTitle="Entrar"
      footerDescription="Lembrou sua senha?"
      footerLink={
        role !== 'ADMINISTRATOR'
          ? !isCustomer
            ? '/entrar'
            : `/loja/${slug}/entrar`
          : '/gestao/entrar'
      }
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-2"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="Informe seu email"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <ButtonLoading className="w-fit" disabled={isPending}>
            Recuperar senha
          </ButtonLoading>
        </form>
      </Form>
    </Wrapper>
  )
}
