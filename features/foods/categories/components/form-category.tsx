import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  insertCategoryFormSchema,
  InsertCategoryFormValues,
} from '@/features/foods/categories/schema'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { FormDialog } from '@/components/form-dialog'
import { InputImage } from '@/components/input-custom'

type Props = {
  id?: string
  isOpen: boolean
  isPending?: boolean
  status?: boolean
  defaultValues: InsertCategoryFormValues
  onDelete?: () => void
  handleClose: () => void
  onSubmit: (values: InsertCategoryFormValues) => void
}

export const FormCategory = ({
  id,
  isOpen,
  isPending,
  status,
  defaultValues,
  onDelete,
  handleClose,
  onSubmit,
}: Props) => {
  const form = useForm<InsertCategoryFormValues>({
    resolver: zodResolver(insertCategoryFormSchema),
    defaultValues,
    shouldFocusError: true,
    reValidateMode: 'onChange',
    mode: 'all',
  })

  const handleSubmit = (values: InsertCategoryFormValues) => {
    onSubmit(values)
  }

  useEffect(() => {
    form.reset()
  }, [isOpen])

  return (
    <FormDialog
      id={id}
      formId="form-category"
      title={id ? 'Editar categoria' : 'Nova categoria'}
      description="Preencha os campos abaixo, e ao finalizar clique em “Salvar”."
      isOpen={isOpen}
      isPending={isPending}
      status={status}
      onDelete={onDelete}
      handleClose={handleClose}
      className="max-w-lg"
    >
      <Form {...form}>
        <form
          id="form-category"
          className="flex flex-col gap-4"
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
                    placeholder="Nome da categoria"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Imagem</FormLabel>
                <FormControl>
                  <InputImage
                    value={field.value}
                    onChange={field.onChange}
                    accept="image/*"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </FormDialog>
  )
}
