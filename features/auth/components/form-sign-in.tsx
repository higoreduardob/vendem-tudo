'use client'

import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'

import { UserRole } from '@prisma/client'

import {
  signInDefaultValues,
  SignInFormValues,
  signInSchema,
} from '@/features/auth/schema'

import { useSignIn } from '@/features/auth/api/use-sign-in'
import { useCurrentUser } from '@/features/auth/hooks/use-current-user'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { InputPassword } from '@/components/input-custom'
import { ButtonLoading } from '@/components/button-custom'
import { Wrapper } from '@/features/auth/components/wrapper'

export const FormSignIn = ({
  role,
  storeId,
  slug,
  isCustomer = false,
}: {
  role: UserRole
  storeId?: string
  slug?: string
  isCustomer?: boolean
}) => {
  const router = useRouter()
  const [twoFactor, setTwoFactor] = useState(false)
  const [redirect, setRedirect] = useState('')

  const { update } = useCurrentUser()
  const mutation = useSignIn(role, storeId)
  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { ...signInDefaultValues, role },
    shouldFocusError: true,
    reValidateMode: 'onChange',
    mode: 'all',
  })

  const isPending = mutation.isPending

  const onSubmit = (values: SignInFormValues) => {
    handleSubmit(values)
  }

  const handleSubmit = (values: SignInFormValues) => {
    mutation.mutate(values, {
      onSuccess: (res) => {
        if (res) {
          if ('twoFactor' in res) {
            setTwoFactor(true)
          }
          if ('redirect' in res) {
            setRedirect(res.redirect as string)
            if ('update' in res) {
              update()
            }
          }
        }
      },
    })
  }

  const { setValue } = form

  useEffect(() => {
    if (twoFactor) {
      setValue('code', '')
    }
  }, [twoFactor, setValue])

  useEffect(() => {
    if (redirect) {
      router.push(redirect)
    }
  }, [redirect])

  return (
    <Wrapper
      title="Entrar"
      description={`Digite seu ${
        twoFactor ? 'código' : 'e-mail e senha'
      } abaixo para acessar em sua conta`}
      footerTitle={role !== 'ADMINISTRATOR' ? 'Cadastrar' : undefined}
      footerDescription={
        role !== 'ADMINISTRATOR' ? 'Não possui uma conta?' : undefined
      }
      footerLink={
        role !== 'ADMINISTRATOR'
          ? !isCustomer
            ? '/planos'
            : `/loja/${slug}/cadastrar`
          : undefined
      }
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-2"
        >
          {twoFactor ? (
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Código</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ''}
                      placeholder="Informe seu código"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            <>
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
              <Link
                href={
                  role !== 'ADMINISTRATOR'
                    ? !isCustomer
                      ? '/recuperar-senha'
                      : `/loja/${slug}/recuperar-senha`
                    : '/gestao/recuperar-senha'
                }
                className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
              >
                Esqueceu a senha?
              </Link>
            </>
          )}
          <ButtonLoading className="w-fit" disabled={isPending}>
            Entrar
          </ButtonLoading>
        </form>
      </Form>
    </Wrapper>
  )
}
