import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Donut, Eye } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'

import { FoodAdditionalRole } from '@prisma/client'

import { createEnumOptions } from '@/lib/utils'
import { translateFoodAdditionalRole } from '@/lib/i18n'

import {
  insertAdditionalSchema,
  InsertAdditionalFormValues,
} from '@/features/foods/additionals/schema'

import { useGetFoodOptions } from '@/features/foods/additionals/options/api/use-get-food-options'
import { useNewFoodOption } from '@/features/foods/additionals/options/hooks/use-new-food-option'
import { useOpenFoodOptionData } from '@/features/foods/additionals/options/hooks/use-open-food-option'

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
import { Button } from '@/components/ui/button'
import { FormDialog } from '@/components/form-dialog'
import { SelectFilter } from '@/components/select-filter'
import { SelectCreate } from '@/components/select-create'
import { SelectContent } from '@/components/select-content'

type Props = {
  id?: string
  isOpen: boolean
  isPending?: boolean
  status?: boolean
  defaultValues: InsertAdditionalFormValues
  onDelete?: () => void
  handleClose: () => void
  onSubmit: (values: InsertAdditionalFormValues) => void
}

export const FormFoodAdditional = ({
  id,
  isOpen,
  isPending,
  status,
  defaultValues,
  onDelete,
  handleClose,
  onSubmit,
}: Props) => {
  const { onOpen: onOpenNewFoodOption } = useNewFoodOption()
  const { onOpen: onOpenFoodOptionData } = useOpenFoodOptionData()
  const form = useForm<InsertAdditionalFormValues>({
    resolver: zodResolver(insertAdditionalSchema),
    defaultValues,
    shouldFocusError: true,
    reValidateMode: 'onChange',
    mode: 'all',
  })

  const roleOptions: FilterOptionsProps = createEnumOptions(
    FoodAdditionalRole,
    (key) => translateFoodAdditionalRole(key as FoodAdditionalRole)
  )

  const optionsQuery = useGetFoodOptions()
  const options: FilterOptionsProps = (optionsQuery.data ?? []).map(
    (option) => ({
      label: option.name || '',
      value: option.id,
    })
  )
  const onCreateOption = () => {
    onOpenNewFoodOption()
  }

  const handleSubmit = (values: InsertAdditionalFormValues) => {
    onSubmit(values)
  }

  useEffect(() => {
    form.reset()
  }, [isOpen])

  return (
    <FormDialog
      id={id}
      formId="form-food-additional"
      title={id ? 'Editar adicional' : 'Novo adicional'}
      description="Preencha os campos abaixo, e ao finalizar clique em “Salvar”."
      isOpen={isOpen}
      isPending={isPending}
      status={status}
      onDelete={onDelete}
      handleClose={handleClose}
      className="max-w-3xl"
    >
      <Form {...form}>
        <form
          id="form-food-additional"
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <div className="flex flex-col gap-4 md:flex-row">
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
                      placeholder="Nome do adicional"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Descrição do adicional"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="required"
              render={({ field }) => (
                <FormItem className="flex items-center gap-4">
                  <FormLabel htmlFor="required">Obrigatório</FormLabel>
                  <FormControl>
                    <Switch
                      id="required"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col gap-4 md:flex-row">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Método</FormLabel>
                  <SelectFilter
                    placeholder="Selecione o método"
                    defaultValue={field.value}
                    value={field.value}
                    data={roleOptions}
                    onChange={field.onChange}
                    className="w-full"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.getValues('required') &&
              form.getValues('role') !== FoodAdditionalRole.UNIQUE && (
                <FormField
                  control={form.control}
                  name="minRequired"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Mínimo Obrigatório</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value || ''}
                          disabled={isPending}
                          placeholder="Mínimo do adicional"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            {form.getValues('role') !== FoodAdditionalRole.UNIQUE && (
              <FormField
                control={form.control}
                name="limit"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Limite</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value || ''}
                        disabled={isPending}
                        placeholder="Limite do adicional"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
          <FormField
            control={form.control}
            name="options"
            render={({ field }) => (
              <FormItem className="w-full">
                <div className="flex items-center justify-between">
                  <FormLabel htmlFor="options">Opções</FormLabel>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs text-muted-foreground"
                    type="button"
                    onClick={onOpenFoodOptionData}
                  >
                    <Eye className="size-4" />
                    Todos
                  </Button>
                </div>
                <FormControl>
                  <SelectCreate
                    id="options"
                    placeholder="Opções"
                    options={options}
                    onCreate={onCreateOption}
                    value={''}
                    onChange={(option) => {
                      const values = field.value
                      const newValues = values
                        ? values.concat(option!)
                        : [option]
                      field.onChange(newValues)
                    }}
                    disabled={isPending}
                    // isLoading={isLoadingCreateCategory}
                  />
                </FormControl>
                <SelectContent
                  title="Opções"
                  description="Veja aqui todas as opções deste adicional"
                  values={field.value}
                  options={options}
                  icon={Donut}
                  emptyMessage="Nenhuma opção neste adicional"
                  onChange={field.onChange}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </FormDialog>
  )
}
