import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Eye, Plus, Sandwich, X } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'

import { cn } from '@/lib/utils'

import {
  insertFoodFormSchema,
  InsertFoodFormValues,
} from '@/features/foods/schema'

import { useGetCategories } from '@/features/foods/categories/api/use-get-categories'
import { useCreateCategory } from '@/features/foods/categories/api/use-create-category'
import { useGetFoodAdditionals } from '@/features/foods/additionals/api/use-get-food-additionals'
import { useNewFoodAdditional } from '@/features/foods/additionals/hooks/use-new-food-additional'
import { useOpenFoodAdditionalData } from '@/features/foods/additionals/hooks/use-open-food-additional'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FormDialog } from '@/components/form-dialog'
import { InputImage } from '@/components/input-custom'
import { AmountInput } from '@/components/amount-input'
import { TooltipProvider } from '@/components/ui/tooltip'
import { SelectCreate } from '@/components/select-create'
import { SelectContent } from '@/components/select-content'
import { MinimalTiptapEditor } from '@/components/minimal-tiptap'

type Props = {
  id?: string
  isOpen: boolean
  isPending?: boolean
  status?: boolean
  defaultValues: InsertFoodFormValues
  onDelete?: () => void
  handleClose: () => void
  onSubmit: (values: InsertFoodFormValues) => void
}

export const FormFood = ({
  id,
  isOpen,
  isPending,
  status,
  defaultValues,
  onDelete,
  handleClose,
  onSubmit,
}: Props) => {
  const { onOpen: onOpenFoodAdditional } = useNewFoodAdditional()
  const { onOpen: onOpenFoodAdditionalData } = useOpenFoodAdditionalData()
  const form = useForm<InsertFoodFormValues>({
    resolver: zodResolver(insertFoodFormSchema),
    defaultValues,
    shouldFocusError: true,
    reValidateMode: 'onChange',
    mode: 'all',
  })

  const categoriesQuery = useGetCategories()
  const categoryMutation = useCreateCategory()
  const categoryOptions: FilterOptionsProps = (categoriesQuery.data ?? []).map(
    (category) => ({
      label: category.name,
      value: category.id,
    })
  )
  const onCreateCategory = (name: string) => categoryMutation.mutate({ name })
  const isLoadingCreateCategory = categoryMutation.isPending

  const additionalsQuery = useGetFoodAdditionals()
  const additionalOptions: FilterOptionsProps = (
    additionalsQuery.data ?? []
  ).map((additional) => ({
    label: additional.name,
    value: additional.id,
  }))
  const onCreateAdditional = () => {
    onOpenFoodAdditional()
  }

  const handleSubmit = (values: InsertFoodFormValues) => {
    onSubmit(values)
  }

  useEffect(() => {
    form.reset()
  }, [isOpen])

  return (
    <FormDialog
      id={id}
      formId="form-food"
      title={id ? 'Editar produto' : 'Novo produto'}
      description="Preencha os campos abaixo, e ao finalizar clique em “Salvar”."
      isOpen={isOpen}
      isPending={isPending}
      status={status}
      onDelete={onDelete}
      handleClose={handleClose}
      className="max-w-[90%] md:max-w-3xl"
    >
      <Form {...form}>
        <form
          id="form-food"
          className="flex flex-col gap-2"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
            <div className="flex flex-col gap-2">
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
                        placeholder="Nome do produto"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel htmlFor="category">Categoria</FormLabel>
                    <FormControl>
                      <SelectCreate
                        id="category"
                        placeholder="Categoria"
                        options={categoryOptions}
                        onCreate={onCreateCategory}
                        value={field.value}
                        onChange={field.onChange}
                        disabled={isPending}
                        isLoading={isLoadingCreateCategory}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Preço</FormLabel>
                      <FormControl>
                        <AmountInput
                          {...field}
                          placeholder="Valor do produto"
                          isPending={isPending}
                          disabled
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="promotion"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Promoção</FormLabel>
                      <FormControl>
                        <AmountInput
                          {...field}
                          value={field.value || ''}
                          placeholder="Valor promocional"
                          isPending={isPending}
                          disabled
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <TooltipProvider delayDuration={0}>
                    <MinimalTiptapEditor
                      {...field}
                      throttleDelay={0}
                      className={cn(
                        'h-full min-h-56 max-w-full min-w-full w-[241px] rounded-md',
                        {
                          'border-destructive focus-within:border-destructive':
                            form.formState.errors.description,
                        }
                      )}
                      editorContentClassName="overflow-auto h-full flex grow"
                      output="html"
                      placeholder="Descrição do produto"
                      editable={true}
                      editorClassName="focus:outline-none p-2 h-full grow"
                    />
                  </TooltipProvider>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ingredients"
            render={() => (
              <FormItem className="w-full mt-12">
                <FormLabel htmlFor="ingredient">Ingredientes</FormLabel>
                <div className="flex gap-2">
                  <Input
                    id="ingredient"
                    placeholder="Digite um ingrediente"
                    disabled={isPending}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                        e.preventDefault()
                        const currentIngredients =
                          form.getValues('ingredients') || []
                        form.setValue('ingredients', [
                          ...currentIngredients,
                          e.currentTarget.value.trim(),
                        ])
                        e.currentTarget.value = ''
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      const input =
                        document.querySelector<HTMLInputElement>('#ingredient')
                      if (input?.value.trim()) {
                        const currentIngredients =
                          form.getValues('ingredients') || []
                        form.setValue('ingredients', [
                          ...currentIngredients,
                          input.value.trim(),
                        ])
                        input.value = ''
                      }
                    }}
                  >
                    <Plus className="size-4" />
                  </Button>
                </div>
                <FormMessage />
                <div className="flex flex-wrap gap-2 mt-4">
                  {form.watch('ingredients')?.map((ingredient, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {ingredient}
                      <button
                        type="button"
                        onClick={() => {
                          const updatedIngredients = form
                            .getValues('ingredients')
                            .filter((_, i) => i !== index)
                          form.setValue('ingredients', updatedIngredients)
                        }}
                        className="ml-1 text-red-500 hover:text-red-700"
                      >
                        <X className="size-4" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="additionals"
            render={({ field }) => (
              <FormItem className="w-full">
                <div className="flex items-center justify-between">
                  <FormLabel htmlFor="additionals">Adicionais</FormLabel>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs text-muted-foreground"
                    type="button"
                    onClick={onOpenFoodAdditionalData}
                  >
                    <Eye className="size-4" />
                    Todos
                  </Button>
                </div>
                <FormControl>
                  <SelectCreate
                    id="additionals"
                    placeholder="Adicionais"
                    options={additionalOptions}
                    onCreate={onCreateAdditional}
                    value={''}
                    onChange={(additional) => {
                      const values = field.value
                      const newValues = values
                        ? values.concat(additional!)
                        : [additional]
                      field.onChange(newValues)
                    }}
                    disabled={isPending}
                    isLoading={isLoadingCreateCategory}
                  />
                </FormControl>
                <SelectContent
                  title="Adicionais"
                  description="Veja aqui todos os adicionais deste produto"
                  values={field.value}
                  options={additionalOptions}
                  icon={Sandwich}
                  emptyMessage="Nenhum adicional neste produto"
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
