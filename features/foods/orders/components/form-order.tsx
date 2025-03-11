'use client'

import Link from 'next/link'
import Image from 'next/image'
import { HelpCircle } from 'lucide-react'

import { formatCurrency } from '@/lib/utils'
import { translateStoreRole } from '@/lib/i18n'

import { useOpenStore } from '@/hooks/use-store'

import {
  InsertProductInCartFormValues,
  useCartStore,
} from '@/features/foods/orders/schema'

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

type Props = {
  isOpen: boolean
  handleClose: () => void
}

type OrderItemProps = {
  add: () => void
  remove: () => void
}

const OrderItem = ({
  add,
  remove,
  ...product
}: InsertProductInCartFormValues & OrderItemProps) => {
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
          <div className="flex justify-between items-center">
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
              <div className="flex gap-4 mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:bg-red-600 hover:text-red-50"
                  onClick={add}
                >
                  Adicionar +1
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:bg-black hover:text-white"
                  onClick={remove}
                >
                  Remover -1
                </Button>
              </div>
            </div>
            <div className="flex flex-col items-end">
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

export const FormOrder = ({ isOpen, handleClose }: Props) => {
  const { store } = useOpenStore()
  const { cart, addCart, removeCart } = useCartStore()

  if (!store) return null

  const roleOptions = store.role.map((role) => translateStoreRole(role))

  const calculateTotal = () => {
    const subAmount = cart.reduce((total, item) => total + item.subAmount, 0)
    const amount = subAmount + 10

    return { subAmount, amount }
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle>
            <div className="flex-1">
              <p className="text-sm">
                <span className="text-amber-600">
                  O pedido mínimo para essa loja é de{' '}
                </span>
                <span className="text-amber-600 font-medium">R$ 25,00</span>
                <span className="text-amber-600">
                  , não inclusa a taxa de entrega.
                </span>
              </p>
            </div>
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h2 className="font-medium text-lg">{store.name}</h2>
            <Link href="#" className="text-sm text-red-500 font-medium">
              Ver Cardápio
            </Link>
          </div>

          <p className="text-muted-foreground text-sm">
            {roleOptions.map((role, index) => (
              <span key={index}>{role}</span>
            ))}
          </p>
        </div>

        <Separator />

        <ScrollArea className="h-full space-y-4 pr-2">
          {cart.map((item, index) => (
            <OrderItem
              key={index}
              add={() => addCart(index)}
              remove={() => removeCart(index)}
              {...item}
            />
          ))}
        </ScrollArea>

        <Separator className="mt-auto" />

        {/* <div className="flex justify-between items-center py-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-6 bg-gray-100 flex items-center justify-center rotate-12">
              <div className="w-6 h-4 border border-dashed border-gray-400"></div>
            </div>
            <div>
              <p className="font-medium">Cupom</p>
              <p className="text-sm text-muted-foreground">
                1 cupom disponível
              </p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </div>

        <Separator /> */}

        <div className="space-y-2 py-2">
          <div className="flex justify-between">
            <p className="text-muted-foreground">Subtotal</p>
            <p className="font-medium">
              {formatCurrency(calculateTotal().subAmount)}
            </p>
          </div>
          {/* <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              <p className="text-muted-foreground">Taxa de Serviço</p>
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="font-medium">R$ 0,99</p>
          </div> */}
          <div className="flex justify-between">
            <p className="text-muted-foreground">Taxa de entrega</p>
            <p className="text-green-500 font-medium">Grátis</p>
          </div>
        </div>

        <Separator />

        <SheetFooter>
          <div className="flex flex-col gap-2 w-full">
            <div className="flex justify-between w-full mb-4">
              <p className="font-medium text-lg">Total</p>
              <p className="font-medium text-lg">
                {formatCurrency(calculateTotal().amount)}
              </p>
            </div>
            <Button className="w-full bg-pink-300 hover:bg-pink-400 text-white">
              Escolher forma de pagamento
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
