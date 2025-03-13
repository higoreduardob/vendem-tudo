'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Banknote, CreditCard, DollarSign } from 'lucide-react'

import { StorePayment } from '@prisma/client'

import { useOpenStore } from '@/hooks/use-store'
import { useCurrentUser } from '@/features/auth/hooks/use-current-user'
import { useCreateOrder } from '@/features/foods/orders/api/use-create-order'

import { cn, formatCurrency } from '@/lib/utils'
import { translateStorePayment } from '@/lib/i18n'

import {
  type InsertCheckoutFormValues,
  insertCheckoutSchema,
  useCartStore,
  useCheckoutStore,
} from '@/features/foods/orders/schema'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import {
  OrderItem,
  OrderShipping,
} from '@/features/foods/orders/components/form-order'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

const PaymentOption = ({
  currValue,
  value,
  onClick,
}: {
  currValue: StorePayment
  value: StorePayment
  onClick: () => void
}) => {
  const payment = () => {
    switch (value) {
      case 'PIX':
        return {
          title: `Pague com ${translateStorePayment(value)}`,
          description: 'Pague com PIX na entrega',
          icon: <Banknote className="text-teal-500" />,
        }
      case 'MASTER_CREDIT_CARD':
        return {
          title: `Pague com ${translateStorePayment(value)}`,
          description: 'Pague com seu cartão de crédito Mastercard',
          icon: <CreditCard className="text-teal-500" />,
        }
      case 'VISA_CREDIT_CARD':
        return {
          title: `Pague com ${translateStorePayment(value)}`,
          description: 'Pague com seu cartão de crédito Visa',
          icon: <CreditCard className="text-blue-500" />,
        }
      case 'MASTER_DEBIT_CARD':
        return {
          title: `Pague com ${translateStorePayment(value)}`,
          description: 'Pague com seu cartão de débito Master',
          icon: <CreditCard className="text-red-500" />,
        }
      case 'VISA_DEBIT_CARD':
        return {
          title: `Pague com ${translateStorePayment(value)}`,
          description: 'Pague com seu cartão de débito Visa',
          icon: <CreditCard className="text-blue-500" />,
        }
      case 'MEAL_VOUCHER':
        return {
          title: `Pague com ${translateStorePayment(value)}`,
          description: 'Pague com seu vale alimentação',
          icon: <CreditCard className="text-yellow-500" />,
        }
      default:
        return {
          title: `Pague com ${translateStorePayment(value)}`,
          description: 'Pague em dinheiro na entrega',
          icon: <DollarSign className="text-green-500" />,
        }
    }
  }

  return (
    <div
      className={cn(
        'border rounded-sm p-2 cursor-pointer transition-colors',
        value === currValue
          ? 'border-teal-500 bg-teal-50'
          : 'border-gray-200 hover:border-teal-500'
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-teal-100 rounded-sm flex items-center justify-center">
          {payment().icon}
        </div>
        <div>
          <p className="text-gray-900 font-medium text-sm">{payment().title}</p>
          <p className="text-gray-500 text-xs">{payment().description}</p>
        </div>
      </div>
    </div>
  )
}

export const FormCheckout = () => {
  const { store } = useOpenStore()
  const { user } = useCurrentUser()
  const { clearCart } = useCartStore()
  const { order, isOpen, onClose } = useCheckoutStore()

  const mutation = useCreateOrder()
  const isPending = mutation.isPending

  const form = useForm<InsertCheckoutFormValues>({
    resolver: zodResolver(insertCheckoutSchema),
    defaultValues: { ...order },
    shouldFocusError: true,
    reValidateMode: 'onChange',
    mode: 'all',
  })

  useEffect(() => {
    if (order) {
      form.reset(order)
    }
  }, [order, form])

  if (!store || !user || !order) return null

  const { payment, address: storeAddress } = store
  const { address: userAddress } = user
  const { shippingRole, fee, deadlineAt } = order

  const address = shippingRole === 'DELIVERY' ? userAddress : storeAddress
  const selectedPayment = form.watch('payment')

  const handleSubmit = (values: InsertCheckoutFormValues) => {
    console.log(values)
    mutation.mutate(values, {
      onSuccess: () => {
        onClose()
        clearCart()
      },
    })
  }

  console.log(form.formState.errors)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-none w-full sm:max-w-[700px] max-h-[90%] overflow-y-auto p-4">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-black">
            Finalize seu pedido
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Selecione a forma de pagamento para concluir seu pedido
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <OrderShipping
            address={address!}
            role={shippingRole}
            fee={fee || undefined}
            deadlineAt={deadlineAt || undefined}
            isNonAddressChange
            isColumnDirection
          />
          <div className="grid grid-cols-2 gap-2">
            <Form {...form}>
              <form
                id="form-cart"
                className="flex flex-col gap-2"
                onSubmit={form.handleSubmit(handleSubmit)}
              >
                <FormField
                  control={form.control}
                  name="payment"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      {payment.map((item, index) => (
                        <FormControl key={index}>
                          <PaymentOption
                            currValue={form.watch('payment')}
                            value={item}
                            onClick={() => field.onChange(item)}
                          />
                        </FormControl>
                      ))}

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {selectedPayment === StorePayment.CASH && (
                  <FormField
                    control={form.control}
                    name="moneyChange"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            placeholder="Troco para quanto?"
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            value={field.value ?? ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <Button className="bg-teal-500 text-white font-medium hover:bg-teal-600 transition-colors">
                  Confirmar pagamento
                </Button>
              </form>
            </Form>
            <div className="flex flex-col gap-2">
              <ScrollArea className="pr-4 flex-grow">
                {order.items.map((item, index) => (
                  <OrderItem key={index} {...item} isNonAddedProduct />
                ))}
              </ScrollArea>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <p className="text-muted-foreground">Subtotal</p>
                  <p className="font-medium">
                    {formatCurrency(form.watch('subAmount'))}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-muted-foreground">Taxa de entrega</p>
                  {form.getValues('fee') ? (
                    <p className="text-[#3A3A3A] font-medium">
                      {formatCurrency(form.watch('fee') || 0)}
                    </p>
                  ) : (
                    <p className="text-green-500 font-medium">Grátis</p>
                  )}
                </div>
                <div className="flex justify-between w-full mb-4">
                  <p className="font-medium text-lg">Total</p>
                  <p className="font-medium text-lg">
                    {formatCurrency(form.watch('amount'))}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
