import {
  Ban,
  CreditCard,
  HelpCircle,
  MapPin,
  Timer,
  Utensils,
} from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'
import { create } from 'zustand'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { ShippingRole } from '@prisma/client'

import { ExtendedUser } from '@/types/next-auth'

import { zipCodeMask } from '@/lib/format'
import { translateStoreRole } from '@/lib/i18n'
import { cn, formatCurrency, isStoreOpen } from '@/lib/utils'

import { ResponseType, useOpenStore } from '@/hooks/use-store'
import { useOpenUpdate } from '@/features/auth/hooks/use-open-update'
import { useCurrentUser } from '@/features/auth/hooks/use-current-user'
import { useOpenCheckout } from '@/features/foods/orders/components/form-checkout'

import {
  type InsertOrderFormValues,
  insertOrderSchema,
  type InsertProductInCartFormValues,
  useCartStore,
} from '@/features/foods/orders/schema'
import type { AddressFormValues } from '@/features/common/schema'
import { InsertShippingFormValues } from '@/features/stores/schema'

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Form,
} from '@/components/ui/form'
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

type OrderItemProps = InsertProductInCartFormValues & {
  add?: () => void
  remove?: () => void
  isNonAddedProduct?: boolean
}

type OrderShippingProps = {
  address: AddressFormValues
  role: ShippingRole
  fee?: number
  deadlineAt?: number
  isNonAddressChange?: boolean
  isColumnDirection?: boolean
}

type FormOrderComponentProps = {
  isOpen: boolean
  isOpenStore: boolean
  handleClose: () => void
  store: ResponseType
  user: ExtendedUser
  cart: InsertProductInCartFormValues[]
  addCart: (index: number) => void
  removeCart: (index: number) => void
  onSubmit: (order: InsertOrderFormValues) => void
  clearCart: () => void
  defaultValues: InsertOrderFormValues
}

type OpenOrderState = {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

export const useOpenOrder = create<OpenOrderState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}))

export const OrderItem = ({
  add,
  remove,
  isNonAddedProduct = false,
  ...product
}: OrderItemProps) => {
  const { name, image, quantity, amount, subAmount, additionals, obs } = product

  return (
    <div className="p-2 rounded-md w-full hover:bg-gray-50">
      <div className="flex items-center gap-2">
        <div className="bg-[#0000000d] h-20 w-20 flex-shrink-0 rounded-lg flex items-center justify-center">
          <Image
            src={image || '/placeholder.svg'}
            alt={name}
            width={80}
            height={80}
            className="object-cover transition-transform hover:scale-105 rounded-lg"
          />
        </div>
        <div className="w-full">
          <p className="font-medium">{name}</p>
          <div className="flex xs:flex-row flex-col justify-between xs:items-center">
            <div className="flex flex-col gap-1">
              {additionals?.length > 0 && (
                <div className="flex items-center gap-1">
                  <p className="text-muted-foreground text-sm">Adicionais</p>
                  <TooltipProvider>
                    <Tooltip delayDuration={100}>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground cursor-pointer" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="flex flex-col gap-1">
                          {additionals.map((additional, index) => (
                            <div key={index}>
                              <p className="text-xs">{additional.name}</p>
                              <ul>
                                {additional.options?.map((option, key) => (
                                  <li
                                    key={key}
                                    className="list-inside text-xs list-disc text-muted-foreground"
                                  >
                                    <span className="font-semibold">
                                      {option.name}:
                                    </span>{' '}
                                    {option.quantity} x{' '}
                                    {formatCurrency(option.price)}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
              {!isNonAddedProduct && (
                <div className="flex xs:flex-row flex-col gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-500 border-red-100 hover:bg-red-600 hover:text-red-50"
                    onClick={add}
                  >
                    Adicionar +1
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-muted-foreground border-muted-foreground hover:bg-black hover:text-white"
                    onClick={remove}
                  >
                    Remover -1
                  </Button>
                </div>
              )}
            </div>
            <div className="flex flex-col xs:items-end">
              <p className="text-sm text-muted-foreground">
                Qtd: {quantity} unids
              </p>
              <p className="font-medium text-xl">{formatCurrency(subAmount)}</p>
              <div className="flex items-center gap-2">
                <p className="text-xs text-muted-foreground">Unitário:</p>
                <p className="font-medium text-xs">{formatCurrency(amount)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {obs && (
        <div className="flex items-end gap-1">
          <p className="text-muted-foreground text-sm">Observação:</p>
          <span className="text-xs text-muted-foreground block">{obs}</span>
        </div>
      )}
    </div>
  )
}

export const OrderShipping = ({
  address,
  role,
  fee,
  deadlineAt,
  isNonAddressChange = false,
  isColumnDirection = false,
}: OrderShippingProps) => {
  const { onOpen } = useOpenUpdate()

  return (
    <div
      className={cn(
        '',
        isColumnDirection ? 'grid grid-cols-2 gap-2' : 'space-y-2'
      )}
    >
      <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-sm">
        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
          <MapPin className="text-red-500 w-5 h-5" />
        </div>

        <div className="flex-1">
          <p className="text-[#3A3A3A] font-medium">
            {address.street} - {address?.number || 'S/N'}
          </p>
          <p className="text-gray-500 text-sm">
            {address.neighborhood}, {zipCodeMask(address.zipCode)} -{' '}
            {address.city}/{address.state}
          </p>
        </div>
        {role === 'DELIVERY' && !isNonAddressChange && (
          <button
            type="button"
            className="text-red-500 text-sm font-medium"
            onClick={onOpen}
          >
            Trocar
          </button>
        )}
      </div>

      <div className="border border-gray-200 rounded-sm p-2">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-red-500 text-sm mb-1">
              {role === 'DELIVERY' ? 'Entrega' : 'Retirada'}
            </p>
            <p className="text-gray-500 text-sm">
              {deadlineAt ? `Hoje, ${deadlineAt} min` : 'Hoje'}
            </p>
          </div>
          {deadlineAt && (
            <div className="text-gray-400">
              <Timer />
            </div>
          )}
        </div>
        {fee ? (
          <p className="text-[#3A3A3A] font-medium mt-2">
            {formatCurrency(fee)}
          </p>
        ) : (
          <p className="text-green-500 font-medium mt-2">Grátis</p>
        )}
      </div>
    </div>
  )
}

type ShippingsResponseType = InsertShippingFormValues & { id: string }

const findShippingAddress = (
  shippings: ShippingsResponseType[],
  userAddress: AddressFormValues
) =>
  shippings.find(
    (shipping) =>
      shipping.neighborhood === userAddress.neighborhood &&
      shipping.city === userAddress.city &&
      shipping.state === userAddress.state
  )

const calculateSubAmount = (cart: InsertProductInCartFormValues[]) =>
  cart.reduce((total, item) => total + item.subAmount, 0)

export const FormOrder = () => {
  const { store } = useOpenStore()
  const { user } = useCurrentUser()
  const { isOpen, onClose } = useOpenOrder()
  const { cart, addCart, removeCart, clearCart } = useCartStore()
  const { onOpen: onOpenCheckout } = useOpenCheckout()

  if (!store || !user) return null

  const { shippings } = store
  const { address: userAddress } = user
  const isOpenStore = isStoreOpen(store.schedules)
  const isDeliveredEnabled = store.shippingRole.includes('DELIVERY')
  const shippingAddress = isDeliveredEnabled
    ? findShippingAddress(shippings, userAddress)
    : undefined
  const fee = shippingAddress?.fee || 0
  const subAmount = calculateSubAmount(cart)

  const defaultValues: InsertOrderFormValues = {
    storeId: store.id,
    customerId: 'user.id',
    shippingId: shippingAddress?.id,
    deadlineAt: shippingAddress?.deadlineAt,
    subAmount: subAmount,
    amount: subAmount + fee,
    fee: fee,
    shippingRole:
      isDeliveredEnabled && shippingAddress ? 'DELIVERY' : 'PICK_UP_ON_STORE',
    items: cart,
  }

  const onSubmit = (order: InsertOrderFormValues) => {
    onOpenCheckout(order)
    onClose()
  }

  return (
    <FormOrderComponent
      isOpen={isOpen}
      isOpenStore={isOpenStore}
      handleClose={onClose}
      store={store}
      user={user}
      cart={cart}
      addCart={addCart}
      removeCart={removeCart}
      onSubmit={onSubmit}
      clearCart={clearCart}
      defaultValues={defaultValues}
    />
  )
}

const FormOrderComponent = ({
  isOpen,
  isOpenStore,
  handleClose,
  store,
  user,
  cart,
  addCart,
  removeCart,
  onSubmit,
  clearCart,
  defaultValues,
}: FormOrderComponentProps) => {
  const { shippings, address: storeAddress } = store
  const { address: userAddress } = user
  const form = useForm<InsertOrderFormValues>({
    resolver: zodResolver(insertOrderSchema),
    defaultValues,
    shouldFocusError: true,
    reValidateMode: 'onChange',
    mode: 'all',
  })

  const roleOptions = store.role.map((role) => translateStoreRole(role))
  const isEmptyCart = !cart.length

  const isDeliveredEnabled = store.shippingRole.includes('DELIVERY')
  const shippingAddress = isDeliveredEnabled
    ? findShippingAddress(shippings, userAddress)
    : undefined
  const minAmount = shippingAddress?.minimumAmount
  const shippingFee = shippingAddress?.fee || 0

  const watchShippingRole = form.watch('shippingRole')
  const isMinAmount = minAmount
    ? minAmount > form.watch('subAmount') &&
      form.watch('shippingRole') === 'DELIVERY'
    : false

  useEffect(() => {
    const subAmount = calculateSubAmount(cart)

    if (watchShippingRole === 'DELIVERY') {
      form.setValue('fee', shippingFee)
      form.setValue('shippingId', shippingAddress?.id)
      form.setValue('shippingRole', 'DELIVERY')
    } else {
      form.setValue('fee', 0)
      form.setValue('shippingId', null)
      form.setValue('shippingRole', 'PICK_UP_ON_STORE')
    }

    form.setValue('items', cart)
    form.setValue('subAmount', subAmount)
    form.setValue('amount', subAmount + (form.watch('fee') || 0))
  }, [watchShippingRole, shippingFee, shippingAddress, cart, form])

  const handleSubmit = (values: InsertOrderFormValues) => {
    if (!isOpenStore) {
      toast.error('Loja fechada')
      return
    }

    onSubmit(values)
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle>
            <div className="flex-1">
              <p className="text-sm">
                {minAmount ? (
                  <>
                    <span className="text-amber-600">
                      O pedido mínimo para entregar nesta loja é de{' '}
                    </span>
                    <span className="text-amber-600 font-medium">
                      {formatCurrency(minAmount)}
                    </span>
                    <span className="text-amber-600">
                      , não inclusa a taxa de entrega.
                    </span>
                  </>
                ) : (
                  <span className="text-amber-600">
                    Loja sem pedido mínimo de entrega
                  </span>
                )}
              </p>
            </div>
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h2 className="font-medium text-lg">{store.name}</h2>
            <div className="flex items-center gap-2">
              {!isEmptyCart && (
                <Button variant="ghost" onClick={clearCart}>
                  Limpar carrinho
                </Button>
              )}
              <Button
                variant="ghost"
                className="text-sm text-red-500 font-medium"
                onClick={handleClose}
              >
                Ver Cardápio
              </Button>
            </div>
          </div>

          <p className="text-muted-foreground text-sm">
            {roleOptions.map((role, index) => (
              <span key={index}>{role}</span>
            ))}
          </p>
        </div>

        <Separator />

        <ScrollArea className="h-full pr-2 pb-4">
          {!isEmptyCart ? (
            <div className="flex flex-col gap-4">
              {cart.map((item, index) => (
                <OrderItem
                  key={index}
                  add={() => addCart(index)}
                  remove={() => removeCart(index)}
                  {...item}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2 items-center justify-center">
              <p className="text-base leading-tight dark:text-white">
                <span className="font-semibold">
                  Não tem produtos no seu carrinho
                </span>
              </p>
              <Button variant="red" onClick={handleClose}>
                <Utensils /> Ver cardápio
              </Button>
            </div>
          )}
        </ScrollArea>

        {!isEmptyCart && (
          <>
            <Separator className="mt-auto" />

            <Form {...form}>
              <form
                className="flex flex-col gap-2"
                onSubmit={form.handleSubmit(handleSubmit)}
              >
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="shippingRole"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <Tabs
                            value={field.value}
                            onValueChange={(value) =>
                              field.onChange(value as ShippingRole)
                            }
                          >
                            <TabsList className="w-full grid grid-cols-2 h-10 p-0 bg-transparent">
                              {shippingAddress && (
                                <TabsTrigger
                                  value={ShippingRole.DELIVERY}
                                  className="data-[state=active]:border-b-2 data-[state=active]:border-red-500 data-[state=active]:text-red-500 rounded-none h-10 font-medium shadow-none drop-shadow-none data-[state=active]:shadow-none text-gray-400"
                                >
                                  Entrega
                                </TabsTrigger>
                              )}
                              <TabsTrigger
                                value={ShippingRole.PICK_UP_ON_STORE}
                                className={cn(
                                  'data-[state=active]:border-b-2 data-[state=active]:border-red-500 data-[state=active]:text-red-500 rounded-none h-10 font-medium shadow-none drop-shadow-none data-[state=active]:shadow-none text-gray-400',
                                  !shippingAddress && 'col-span-2'
                                )}
                              >
                                Retirada
                              </TabsTrigger>
                            </TabsList>
                            <TabsContent
                              value={ShippingRole.DELIVERY}
                              className="mt-4 space-y-2"
                            >
                              <OrderShipping
                                address={userAddress}
                                role={ShippingRole.DELIVERY}
                                fee={form.getValues('fee') || undefined}
                                deadlineAt={
                                  form.getValues('deadlineAt') || undefined
                                }
                              />
                            </TabsContent>
                            <TabsContent
                              value={ShippingRole.PICK_UP_ON_STORE}
                              className="mt-4 space-y-2"
                            >
                              <OrderShipping
                                address={storeAddress!}
                                role={ShippingRole.PICK_UP_ON_STORE}
                              />
                            </TabsContent>
                          </Tabs>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                <div className="space-y-2 py-2">
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
                </div>

                <Separator />

                <SheetFooter>
                  <div className="flex flex-col gap-2 w-full">
                    <div className="flex justify-between w-full mb-4">
                      <p className="font-medium text-lg">Total</p>
                      <p className="font-medium text-lg">
                        {formatCurrency(form.watch('amount'))}
                      </p>
                    </div>
                    {isMinAmount && minAmount && (
                      <span className="text-sm text-red-500">
                        Subtotal mínimo para entrega:{' '}
                        {formatCurrency(minAmount)}
                      </span>
                    )}
                    <Button
                      variant="red"
                      disabled={isMinAmount || !isOpenStore}
                    >
                      {isOpenStore ? (
                        <>
                          <CreditCard /> Escolher forma de pagamento
                        </>
                      ) : (
                        <>
                          <Ban /> Loja fechada
                        </>
                      )}
                    </Button>
                  </div>
                </SheetFooter>
              </form>
            </Form>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
