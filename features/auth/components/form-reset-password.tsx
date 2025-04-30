'use client'

import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'

import { UserRole } from '@prisma/client'

import {
  resetPasswordDefaultValues,
  ResetPasswordFormValues,
  resetPasswordSchema,
} from '@/features/auth/schema'

import { useResetPassword } from '@/features/auth/api/use-reset-password'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { InputPassword } from '@/components/input-custom'
import { ButtonLoading } from '@/components/button-custom'
import { Wrapper } from '@/features/auth/components/wrapper'
import { ProgressPassword } from '@/components/progress-custom'

export const FormResetPassword = ({
  role,
  slug,
  isCustomer,
}: {
  role: UserRole
  slug?: string
  isCustomer?: boolean
}) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const token = searchParams.get('token')
  const storeId = searchParams.get('storeId') ?? undefined

  if (!token) {
    const url = !isCustomer ? '/entrar' : `/loja/${slug}/entrar`
    toast.error('Token inválido')
    router.push(url)
    return null
  }

  const mutation = useResetPassword(token, role as UserRole, storeId)
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: resetPasswordDefaultValues,
    shouldFocusError: true,
    reValidateMode: 'onChange',
    mode: 'all',
  })

  const isPending = mutation.isPending

  const onSubmit = (values: ResetPasswordFormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        const url = !isCustomer ? '/entrar' : `/loja/${slug}/entrar`
        router.push(url)
      },
    })
  }

  return (
    <Wrapper
    // TODO: Change this msg
      title="Recuperar senha"
      description="Informe o email da sua conta"
      footerTitle="Entrar"
      footerDescription="Lembrou sua senha?"
      footerLink={!isCustomer ? '/entrar' : `/loja/${slug}/entrar`}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-2"
        >
          <div className="flex flex-col gap-2 md:flex-row">
            <div className="flex flex-col gap-1 w-full">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Nova senha</FormLabel>
                    <FormControl>
                      <InputPassword
                        {...field}
                        placeholder="Informe sua senha"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {form.getValues('password') && (
                <ProgressPassword password={form.watch('password')} />
              )}
            </div>
            <FormField
              control={form.control}
              name="repeatPassword"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Repetir nova senha</FormLabel>
                  <FormControl>
                    <InputPassword
                      {...field}
                      placeholder="Repita sua senha"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <ButtonLoading className="w-fit" disabled={isPending}>
            Redefinir senha
          </ButtonLoading>
        </form>
      </Form>
    </Wrapper>
  )
}
