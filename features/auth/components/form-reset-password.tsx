'use client'

import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'

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
  FormMessage,
} from '@/components/ui/form'
import { InputPassword } from '@/components/input-custom'
import { ButtonLoading } from '@/components/button-custom'
import { Wrapper } from '@/features/auth/components/wrapper'
import { ProgressPassword } from '@/components/progress-custom'

export const FormResetPassword = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const token = searchParams.get('token')

  if (!token) {
    toast.error('Token inválido')
    router.push('/entrar')
    return null
  }

  const mutation = useResetPassword(token)
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
        router.push('/entrar')
      },
    })
  }

  return (
    <Wrapper
      title="Recuperar senha"
      description="Informe o email da sua conta"
      footerTitle="Entrar"
      footerDescription="Lembrou sua senha?"
      footerLink="/entrar"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex flex-col gap-1 w-full">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="w-full">
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
                <ProgressPassword password={form.getValues('password')} />
              )}
            </div>
            <FormField
              control={form.control}
              name="repeatPassword"
              render={({ field }) => (
                <FormItem className="w-full">
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
