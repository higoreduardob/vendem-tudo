'use client'

import { Minus, Plus, ShoppingBag, X } from 'lucide-react'

import { useCartStore } from '@/features/foods/orders/schema'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

type Props = {
  isOpen: boolean
  onClose: () => void
}

export function ShoppingCart({ isOpen, onClose }: Props) {
  const { cart } = useCartStore()

  // const updateQuantity = (id: string, newQuantity: number) => {
  //   setCartItems((items) =>
  //     items
  //       .map((item) =>
  //         item.id === id
  //           ? { ...item, quantity: Math.max(0, newQuantity) }
  //           : item
  //       )
  //       .filter((item) => item.quantity > 0)
  //   )
  // }

  // const totalPrice = cartItems.reduce(
  //   (sum, item) => sum + item.price * item.quantity,
  //   0
  // )

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center text-red-800">
            <ShoppingBag className="mr-2 h-5 w-5" />
            Seu Carrinho
          </SheetTitle>
        </SheetHeader>
        <div className="mt-8 flex h-full flex-col">
          <ScrollArea className="flex-1">
            {cart.map((item, index) => (
              <div
                key={index}
                className="mb-4 flex items-center justify-between"
              >
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-500">
                    R$ {item.amount} x {item.quantity}
                  </p>
                </div>
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    // onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="mx-2 w-8 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    // onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-2 h-8 w-8 text-red-500"
                    // onClick={() => updateQuantity(item.id, 0)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </ScrollArea>
          <div className="border-t pt-4">
            <div className="mb-4 flex items-center justify-between text-lg font-semibold">
              <span>Total:</span>
              {/* <span>R$ {totalPrice.toFixed(2)}</span> */}
            </div>
            <Button className="w-full bg-red-600 text-white hover:bg-red-700">
              Finalizar Pedido
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
