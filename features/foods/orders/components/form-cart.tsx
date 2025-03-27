import { create } from 'zustand'
import { useEffect } from 'react'
import { toast as sonner } from 'sonner'
import { useForm } from 'react-hook-form'
import toast, { Toaster } from 'react-hot-toast'
import { zodResolver } from '@hookform/resolvers/zod'

import { formatCurrency } from '@/lib/utils'

import {
  insertProductInCartSchema,
  InsertProductInCartFormValues,
  useCartStore,
} from '@/features/foods/orders/schema'

import { useOpenOrder } from './form-order'

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
import {
  ProductAdditionals,
  ProductDetails,
  ProductImage,
  ProductPrice,
  ResponseType,
} from '@/features/foods/components/card-product'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { ButtonCart } from '@/components/button-custom'
import { ScrollArea } from '@/components/ui/scroll-area'

type Props = {
  isOpen: boolean
  handleClose: () => void
  product: ResponseType
  defaultValues: InsertProductInCartFormValues
  onSubmit: (values: InsertProductInCartFormValues) => void
}

type OpenCartState = {
  isOpen: boolean
  product: ResponseType | null
  onOpen: (product: ResponseType) => void
  onClose: () => void
}

export const useOpenCart = create<OpenCartState>((set) => ({
  isOpen: false,
  product: null,
  onOpen: (product: ResponseType) => set({ product, isOpen: true }),
  onClose: () => set({ isOpen: false, product: null }),
}))

export const FormCart = () => {
  const { isOpen, product, onClose } = useOpenCart()
  const { addProduct } = useCartStore()
  const { onOpen } = useOpenOrder()

  if (!product) return null

  const defaultValues: InsertProductInCartFormValues = {
    productId: product.id,
    name: product.name,
    image: product.image,
    amount: product.promotion || product.price,
    subAmount: product.promotion || product.price,
    quantity: 1,
    obs: '',
    additionals: [],
  }

  const onSubmit = (values: InsertProductInCartFormValues) => {
    addProduct(values)
    sonner.success('Produto adicionado ao carrinho!')
    onClose()
    onOpen()
  }

  return (
    <>
      <Toaster position="bottom-right" />
      <FormCartComponent
        isOpen={isOpen}
        handleClose={onClose}
        product={product}
        defaultValues={defaultValues}
        onSubmit={onSubmit}
      />
    </>
  )
}

const FormCartComponent = ({
  isOpen,
  handleClose,
  product,
  defaultValues,
  onSubmit: onSubmitCart,
}: Props) => {
  const { name, price, promotion, description, ingredients, additionals } =
    product

  const form = useForm<InsertProductInCartFormValues>({
    resolver: zodResolver(insertProductInCartSchema),
    defaultValues,
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
        toast.error(error, {
          duration: 3000,
        })
      })
      return
    }

    const { amount, subAmount } = calculateTotal()
    values.amount = amount
    values.subAmount = subAmount
    onSubmitCart(values)
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

    const amount = basePrice + additionalsPrice
    const subAmount = amount * form.watch('quantity')

    return { amount, subAmount }
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
      <DialogContent className="border-none w-full max-w-[90%] md:max-w-[700px] max-h-[90%] overflow-y-auto p-4">
        <DialogHeader className="flex sm:flex-row flex-col gap-2 items-center justify-between">
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
                  Total: {formatCurrency(calculateTotal().subAmount)}
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
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
