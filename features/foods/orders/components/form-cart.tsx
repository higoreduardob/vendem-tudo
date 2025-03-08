import { toast } from 'sonner'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { formatCurrency } from '@/lib/utils'

import {
  insertProductInCartSchema,
  InsertProductInCartFormValues,
  useCartStore,
} from '@/features/foods/orders/schema'

import {
  ProductAdditionals,
  ProductDetails,
  ProductImage,
  ProductPrice,
  ProductReview,
  ResponseType,
} from '@/features/foods/components/card-product'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { ButtonCart } from '@/components/button-custom'
import { ScrollArea } from '@/components/ui/scroll-area'

type Props = {
  isOpen: boolean
  handleClose: () => void
}

export const FormCart = ({
  isOpen,
  handleClose,
  ...product
}: Props & ResponseType) => {
  const {
    id,
    name,
    image,
    price,
    promotion,
    description,
    ingredients,
    additionals,
  } = product

  const { addProduct } = useCartStore()
  const form = useForm<InsertProductInCartFormValues>({
    resolver: zodResolver(insertProductInCartSchema),
    defaultValues: {
      productId: id,
      name,
      image,
      amount: promotion || price,
      quantity: 1,
      obs: '',
      additionals: [],
    },
    shouldFocusError: true,
    reValidateMode: 'onChange',
    mode: 'all',
  })

  const handleSubmit = (values: InsertProductInCartFormValues) => {
    const errors: string[] = []

    additionals.forEach(({ foodAdditional }) => {
      const { id, name, required, minRequired, role } = foodAdditional
      const selectedOptions =
        values.additionals.find((add) => add.additionalId === id)?.options || []
      const selectedCount = selectedOptions.reduce(
        (acc, opt) => acc + opt.quantity,
        0
      )

      if (required && selectedCount < (minRequired || 1)) {
        let errorMessage = ''
        switch (role) {
          case 'MULTIPLE':
            errorMessage = `Selecione pelo menos ${
              minRequired || 1
            } opção(ões) para "${name}"`
            break
          case 'UNIQUE':
            errorMessage = `Selecione uma opção para "${name}"`
            break
          case 'QUANTITY':
            errorMessage = `Selecione pelo menos ${
              minRequired || 1
            } item(ns) para "${name}"`
            break
        }
        errors.push(errorMessage)
      }
    })

    if (errors.length > 0) {
      errors.forEach((error) => {
        toast.error(error)
      })
      return
    }

    addProduct(values)
    toast.success('Produto adicionado ao carrinho!')
    handleClose()
  }

  const calculateTotal = () => {
    const basePrice = promotion || price
    const additionalsPrice = form
      .watch('additionals')
      .reduce((total, additional) => {
        return (
          total +
          additional.options.reduce((optTotal, option) => {
            return optTotal + option.price * option.quantity
          }, 0)
        )
      }, 0)

    return (basePrice + additionalsPrice) * form.watch('quantity')
  }

  const onSubmit = () => {
    document
      .getElementById('form-cart')
      ?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
  }

  useEffect(() => {
    form.reset()
  }, [isOpen])

  // console.log('Erros do formulário:', form.formState.errors)

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="border-none w-full sm:max-w-[700px] max-h-[90%] overflow-y-auto p-4">
        <DialogHeader className="flex flex-row gap-2 items-center justify-between">
          <div>
            <DialogTitle className="text-2xl font-bold text-black">
              {name}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Ainda não há avaliações para este produto
            </DialogDescription>
          </div>
          <div className="flex flex-col gap-2 sticky">
            <div className="flex items-center gap-2 justify-between">
              <ButtonCart
                value={form.watch('quantity')}
                disabled={false}
                handleDecrement={() => {
                  const newValue = form.getValues('quantity') - 1
                  if (newValue < 1) return

                  form.setValue('quantity', newValue)
                }}
                handleIncrement={() => {
                  const newValue = form.getValues('quantity') + 1
                  form.setValue('quantity', newValue)
                }}
              />
              <div>
                <ProductPrice {...product} />
                <div className="text-sm font-medium mt-1">
                  Total: {formatCurrency(calculateTotal())}
                </div>
              </div>
            </div>
            <Button variant="red" className="w-full" onClick={onSubmit}>
              Adicionar ao Carrinho
            </Button>
          </div>
        </DialogHeader>
        <ScrollArea className="max-h-[800px] pr-3">
          <Form {...form}>
            <form
              id="form-cart"
              className="flex flex-col gap-2"
              onSubmit={form.handleSubmit(handleSubmit)}
            >
              <div className="grid gap-2 py-4 md:grid-cols-2">
                <ProductImage {...product} className="rounded-lg" />
                <div className="flex flex-col gap-2">
                  <ProductDetails
                    description={description}
                    ingredients={ingredients}
                  />
                </div>
              </div>
              <Separator />
              <ProductAdditionals {...product} />
              <FormField
                control={form.control}
                name="obs"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Observação</FormLabel>
                    <span className="text-xs block">
                      Importante! Para pedir adicionais, use as opções acima.
                    </span>
                    <FormControl>
                      <Textarea
                        {...field}
                        value={field.value || ''}
                        placeholder="Observações do pedido"
                        className="resize-none h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Separator />
              <ProductReview />
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
