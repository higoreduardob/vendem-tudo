import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  InsertMessageFormValues,
  insertMessageSchema,
} from '@/features/auth/schema'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { SelectFilter } from '@/components/select-filter'
import { ButtonLoading } from '@/components/button-custom'

type Props = {
  isPending?: boolean
  defaultValues: InsertMessageFormValues
  onSubmit: (values: InsertMessageFormValues) => void
}

export const FormContact = ({ isPending, defaultValues, onSubmit }: Props) => {
  const form = useForm<InsertMessageFormValues>({
    resolver: zodResolver(insertMessageSchema),
    defaultValues,
    shouldFocusError: true,
    reValidateMode: 'onChange',
    mode: 'all',
  })

  const options: FilterOptionsProps = [
    { value: 'duvida', label: 'Dúvida sobre a plataforma' },
    { value: 'problema', label: 'Problema técnico' },
    { value: 'sugestao', label: 'Sugestão de melhoria' },
    { value: 'cobranca', label: 'Questões de cobrança' },
    { value: 'outro', label: 'Outro assunto' },
  ]

  const handleSubmit = (values: InsertMessageFormValues) => {
    onSubmit(values)
  }

  return (
    <Form {...form}>
      <form
        id="form-food"
        className="flex flex-col gap-2"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
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
                  placeholder="Nome completo"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} disabled={isPending} placeholder="Email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Assunto</FormLabel>
              <SelectFilter
                placeholder="Selecione o assunto"
                defaultValue={field.value}
                value={field.value}
                data={options}
                onChange={field.onChange}
                className="w-full"
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Mensagem</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value || ''}
                  placeholder="Insira sua mensagem"
                  className="resize-none h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <ButtonLoading className="w-fit" disabled={isPending}>
          Enviar mensagem
        </ButtonLoading>
      </form>
    </Form>
  )
}
