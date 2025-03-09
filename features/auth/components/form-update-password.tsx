'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { useCurrentUser } from '@/features/auth/hooks/use-current-user'
import { useUpdatePassword } from '@/features/auth/api/use-update-password'

import {
  updatePasswordDefaultValues,
  UpdatePasswordFormValues,
  updatePasswordSchema,
} from '@/features/auth/schema'

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
import { ProgressPassword } from '@/components/progress-custom'

export const FormUpdatePassword = () => {
  const { user } = useCurrentUser()

  if (!user) return null

  const mutation = useUpdatePassword(user.id)
  const form = useForm<UpdatePasswordFormValues>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: updatePasswordDefaultValues,
    shouldFocusError: true,
    reValidateMode: 'onChange',
    mode: 'all',
  })

  const isPending = mutation.isPending

  const onSubmit = (values: UpdatePasswordFormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        form.reset()
      },
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-2"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 items-center gap-2">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Senha</FormLabel>
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
          <div className="flex flex-col gap-1 w-full">
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Nova senha</FormLabel>
                  <FormControl>
                    <InputPassword
                      {...field}
                      placeholder="Nova senha"
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
                <FormLabel>Repetir senha</FormLabel>
                <FormControl>
                  <InputPassword
                    {...field}
                    placeholder="Repita nova senha"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <ButtonLoading disabled={isPending} className="w-fit">
          Salvar
        </ButtonLoading>
      </form>
    </Form>
  )
}
