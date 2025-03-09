'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { searchZipCode } from '@/lib/apis'
import { mapSessionToUpdateData } from '@/lib/utils'
import { cpfCnpjMask, phoneMask, zipCodeMask } from '@/lib/format'

import { UpdateFormValues, updateSchema } from '@/features/auth/schema'

import { useUpdate } from '@/features/auth/api/use-update'
import { useUpdate2fa } from '@/features/auth/api/use-update-2fa'
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
import { Switch } from '@/components/ui/switch'
import { MockForm } from '@/components/mock-form'
import { ButtonLoading } from '@/components/button-custom'

export const FormUpdate = () => {
  const { user, update } = useCurrentUser()

  if (!user) return null

  const mutation = useUpdate(user.id)
  const form = useForm<UpdateFormValues>({
    resolver: zodResolver(updateSchema),
    defaultValues: mapSessionToUpdateData(user),
    shouldFocusError: true,
    reValidateMode: 'onChange',
    mode: 'all',
  })

  const isPending = mutation.isPending

  const onSubmit = (values: UpdateFormValues) => {
    mutation.mutate(values, {
      onSuccess: async () => {
        await update()
      },
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-2"
      >
        <h4 className="text-sm">Informações pessoais</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 items-center gap-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Informe seu nome"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="whatsApp"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>WhatsApp</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    onChange={({ target: { value } }) =>
                      field.onChange(phoneMask(value))
                    }
                    value={field.value || ''}
                    placeholder="WhatsApp de contato"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cpfCnpj"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>CPF/CNPJ</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    onChange={({ target: { value } }) =>
                      field.onChange(cpfCnpjMask(value))
                    }
                    value={field.value || ''}
                    placeholder="CPF/CNPJ do usuário"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <h4 className="text-sm">Informações de endereço</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 items-center gap-2">
          <FormField
            control={form.control}
            name="address.zipCode"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>CEP</FormLabel>
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
                    placeholder="CEP"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address.neighborhood"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Bairro</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    value={field.value || ''}
                    placeholder="Bairro"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address.number"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Número</FormLabel>
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
                <FormLabel>Cidade</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    value={field.value || ''}
                    placeholder="Cidade"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address.state"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Estado</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    value={field.value || ''}
                    placeholder="Estado"
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
                <FormLabel>Rua</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    value={field.value || ''}
                    placeholder="Rua"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address.complement"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Complemento</FormLabel>
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
        </div>

        <ButtonLoading disabled={isPending} className="w-fit">
          Salvar
        </ButtonLoading>
      </form>
    </Form>
  )
}

export const Form2FA = () => {
  const { user, update } = useCurrentUser()

  if (!user) return null

  const { id, isTwoFactorEnabled } = user

  const mutation = useUpdate2fa(user.id)

  return (
    <MockForm>
      <FormItem className="flex items-center gap-3">
        <FormLabel htmlFor="2FA" className="mt-2">
          Autenticação de dois fatores
        </FormLabel>
        <FormControl>
          <Switch
            id="2FA"
            checked={isTwoFactorEnabled}
            disabled={mutation.isPending}
            onCheckedChange={() =>
              mutation.mutate(
                { param: { id } },
                {
                  onSuccess: async () => {
                    update()
                    // signIn(isOauth ? 'google' : 'credentials', {
                    //   redirect: false,
                    // })
                  },
                }
              )
            }
          />
        </FormControl>
      </FormItem>
    </MockForm>
  )
}
