import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import { Check, ChevronLeft, ChevronRight, X } from 'lucide-react'

import { OrderHistoryProgress } from '@prisma/client'

import { formatCurrency } from '@/lib/utils'
import { translateShippingRole, translateStorePayment } from '@/lib/i18n'

import { ResponseType } from '@/app/(protected)/plataforma/pedidos/_features/columns'

import { useUpdateHistory } from '@/features/foods/orders/api/use-update-history'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ButtonLoading } from '@/components/button-custom'
import { ptBR } from 'date-fns/locale'

type Props = {
  orders: ResponseType[]
}

export const OrderNotification = ({ orders }: Props) => {
  const [currentOrderIndex, setCurrentOrderIndex] = useState(0)
  const currentOrder: ResponseType = orders[currentOrderIndex]

  const handlePrevious = () => {
    setCurrentOrderIndex(Math.max(0, currentOrderIndex - 1))
  }
  const handleNext = () => {
    setCurrentOrderIndex(Math.min(orders.length - 1, currentOrderIndex + 1))
  }

  return (
    <>
      {orders.length > 1 && (
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevious}
            disabled={currentOrderIndex === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Pedido {currentOrderIndex + 1} de {orders.length}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            disabled={currentOrderIndex === orders.length - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {!!orders.length && <OrderNotificationItem order={currentOrder} />}
    </>
  )
}

const OrderNotificationItem = ({ order }: { order: ResponseType }) => {
  const mutation = useUpdateHistory(order.id)
  const isPending = mutation.isPending

  const onChange = (progress: OrderHistoryProgress) => {
    mutation.mutate({ progress })
  }

  return (
    <div className="space-x-8">
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Pedido #{order.code}</h3>
            <p className="text-sm text-muted-foreground">
              {format(new Date(order.createdAt), "d MMMM, yyyy 'às' h:mm a", {
                locale: ptBR,
              })}
            </p>
          </div>
          <Badge
            variant={
              order.shippingRole === 'PICK_UP_ON_STORE'
                ? 'outline'
                : 'secondary'
            }
          >
            {translateShippingRole(order.shippingRole)}
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <h4 className="font-medium">Cliente</h4>
            <div className="flex items-center gap-2">
              <p>{order.customer.name}</p>
              <p className="text-sm text-muted-foreground">
                {order.customer.whatsApp}
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-medium">Método de pagamento</h4>
            <div className="flex items-center gap-2">
              <p>{translateStorePayment(order.payment)}</p>
              {!!order.moneyChange && (
                <p className="text-sm mt-1">
                  Troco para: {formatCurrency(order.moneyChange)}
                </p>
              )}
            </div>
          </div>

          {order.shippingRole === 'DELIVERY' && order.address && (
            <div className="sm:col-span-2">
              <h4 className="font-medium mb-2">Endereço de entrega</h4>
              <p className="text-sm">
                {order.address.street}, {order.address.number || 'S/N'}
              </p>
              <p className="text-sm">
                {order.address.neighborhood}, {order.address.city}
              </p>
              {order.address.complement && (
                <p className="text-sm mt-1">Note: {order.address.complement}</p>
              )}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h4 className="font-medium mb-2">Items</h4>
          <ul className="space-y-4">
            {order.items.map((item, index) => (
              <li key={index} className="border-b pb-2 last:border-0 last:pb-0">
                <div className="flex justify-between">
                  <span>{item.food.name}</span>
                  <span className="font-medium">x{item.quantity}</span>
                </div>
                {item.obs && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Observação: {item.obs}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ButtonLoading
          variant="destructive"
          className="flex-1"
          onClick={() => onChange('CANCELLED')}
          disabled={isPending}
        >
          <span className="flex items-center gap-1">
            <X className="h-4 w-4" /> Cancelar
          </span>
        </ButtonLoading>
        <ButtonLoading
          variant="default"
          className="flex-1 bg-green-600 hover:bg-green-700"
          onClick={() => onChange('ACCEPT')}
          disabled={isPending}
        >
          <span className="flex items-center gap-1">
            <Check className="h-4 w-4" /> Aceitar
          </span>
        </ButtonLoading>
      </div>
    </div>
  )
}
