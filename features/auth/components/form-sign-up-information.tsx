'use client'

import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'

import { searchZipCode } from '@/lib/apis'
import { cpfCnpjMask, rgIeMask, zipCodeMask } from '@/lib/format'

import {
  signUpInformationDefaultValues,
  SignUpInformationFormValues,
  signUpInformationSchema,
} from '@/features/auth/schema'

import { useSignUpInformation } from '@/features/auth/api/use-sign-up-information'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ButtonLoading } from '@/components/button-custom'
import { Wrapper } from '@/features/auth/components/wrapper'

export const FormSignUpInformation = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  if (!token) {
    toast.error('Usuário inválido')
    router.push('/entrar')
    return null
  }

  const mutation = useSignUpInformation(token)
  const form = useForm<SignUpInformationFormValues>({
    resolver: zodResolver(signUpInformationSchema),
    defaultValues: signUpInformationDefaultValues,
    shouldFocusError: true,
    reValidateMode: 'onChange',
    mode: 'all',
  })

  const isPending = mutation.isPending

  const onSubmit = (values: SignUpInformationFormValues) => {
    mutation.mutate(values, {
      onSuccess: (res) => {
        if ('token' in res) {
          router.push(`/cadastrar/loja?token=${res.token}`)
        } else {
          toast.error('Falha no cadastro, entre em contato com o administrador')
          router.push('/entrar')
        }
      },
    })
  }

  return (
    <Wrapper
      title="Complete seu cadastro"
      description="Preencha os campos abaixo para completar sua conta"
      isFooter={false}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="flex items-center flex-col sm:flex-row gap-4">
            <FormField
              control={form.control}
              name="rgIe"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      onChange={({ target: { value } }) =>
                        field.onChange(rgIeMask(value))
                      }
                      value={field.value || ''}
                      placeholder="RG/IE do usuário"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address.zipCode"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      onChange={async ({ target: { value } }) => {
                        field.onChange(zipCodeMask(value))
                        const response = await searchZipCode(value)
                        if (response) {
                          form.setValue('address.street', response.street)
                          form.setValue('address.city', response.city)
                          form.setValue('address.state', response.state)
                          form.setValue(
                            'address.neighborhood',
                            response.neighborhood
                          )
                        }
                      }}
                      value={field.value || ''}
                      placeholder="CEP do endereço"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex items-center flex-col sm:flex-row gap-4">
            <FormField
              control={form.control}
              name="address.neighborhood"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      value={field.value || ''}
                      placeholder="Bairro do endereço"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex items-center flex-col sm:flex-row gap-4">
            <FormField
              control={form.control}
              name="address.number"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      value={field.value || ''}
                      placeholder="Número do endereço"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address.city"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      value={field.value || ''}
                      placeholder="Cidade do endereço"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex items-center flex-col sm:flex-row gap-4">
            <FormField
              control={form.control}
              name="address.state"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      value={field.value || ''}
                      placeholder="Estado do endereço"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address.street"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      value={field.value || ''}
                      placeholder="Rua do endereço"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="address.complement"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    value={field.value || ''}
                    placeholder="Complemento do endereço"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col gap-4">
            <ButtonLoading className="w-fit" disabled={isPending}>
              Completar cadastro
            </ButtonLoading>
          </div>
        </form>
      </Form>
    </Wrapper>
  )
}
