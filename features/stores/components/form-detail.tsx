import { useFormContext } from 'react-hook-form'

import { ShippingRole, StorePayment, StoreRole } from '@prisma/client'

import {
  translateShippingRole,
  translateStorePayment,
  translateStoreRole,
} from '@/lib/i18n'
import { cpfCnpjMask, phoneMask } from '@/lib/format'
import { createEnumOptions, generateSlug } from '@/lib/utils'

import { InsertStoreFormValues } from '@/features/stores/schema'

import { useSignUpStoreSlug } from '@/features/auth/api/use-sign-up-store'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { MultiSelector } from '@/components/multi-selector'
import { Textarea } from '@/components/ui/textarea'

export const FormDetail = ({ isPending }: { isPending?: boolean }) => {
  const form = useFormContext<InsertStoreFormValues>()
  const roleOptions: FilterOptionsProps = createEnumOptions(StoreRole, (key) =>
    translateStoreRole(key as StoreRole)
  )
  const paymentOptions: FilterOptionsProps = createEnumOptions(
    StorePayment,
    (key) => translateStorePayment(key as StorePayment)
  )
  const shippingRoleOptions: FilterOptionsProps = createEnumOptions(
    ShippingRole,
    (key) => translateShippingRole(key as ShippingRole)
  )

  const mutationSlug = useSignUpStoreSlug()
  const onSubmitSlug = (values: { slug: string }) => {
    if (!values.slug) return

    mutationSlug.mutate(values)
  }

  return (
    <Card className="w-full border-none p-0 shadow-none space-y-2">
      <CardHeader className=" border p-2 rounded-sm">
        <CardTitle className="text-sm font-medium leading-none">
          Informação da loja
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground leading-none">
          Gerencie as informações da sua loja, incluindo contato e preferências
          de pagamento.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="flex flex-col gap-2 md:flex-row">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    onChange={({ target: { value } }) => {
                      field.onChange(value)
                      const slug = generateSlug(value)
                      form.setValue('slug', slug)
                    }}
                    placeholder="Nome da loja"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem className="w-full">
                <div className="flex items-center justify-between">
                  <FormLabel>Link</FormLabel>
                  <button
                    type="button"
                    className="text-xs bg-red-500 text-white p-0.5 rounded-sm"
                    onClick={() =>
                      onSubmitSlug({ slug: form.getValues('slug') })
                    }
                  >
                    Verificar disponibilidade
                  </button>
                </div>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="Link da loja"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-2 md:flex-row">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value || ''}
                    type="email"
                    disabled={isPending}
                    placeholder="Email da loja"
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
                    value={field.value || ''}
                    onChange={({ target: { value } }) =>
                      field.onChange(cpfCnpjMask(value))
                    }
                    disabled={isPending}
                    placeholder="CPF/CNPJ do(a) dono/loja"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-2 md:flex-row">
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
                    placeholder="WhatsApp de contato da loja"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={() => (
              <FormItem className="w-full">
                <FormLabel>Tipos da loja</FormLabel>
                {roleOptions.map((role, index) => (
                  <FormField
                    key={index}
                    control={form.control}
                    name="role"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={role.value}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(role.value)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, role.value])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== role.value
                                      )
                                    )
                              }}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">
                            {role.label}
                          </FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <MultiSelector
          name="payment"
          label="Formas de pagamento"
          options={paymentOptions}
          disabled={isPending}
        />
        <MultiSelector
          name="shippingRole"
          label="Métodos de entrega"
          options={shippingRoleOptions}
          disabled={isPending}
        />
        <FormField
          control={form.control}
          name="about"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Sobre a loja</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value || ''}
                  placeholder="Bem-vindo à [Nome da Loja]! Aqui, preparamos cada pedido com carinho e qualidade para que sua experiência seja sempre incrível. Explore nosso cardápio e aproveite o melhor do delivery, com rapidez e sabor garantidos!"
                  className="resize-none h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
}
