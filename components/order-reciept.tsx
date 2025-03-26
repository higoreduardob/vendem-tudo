'use client'

import { format } from 'date-fns'
import { Printer } from 'lucide-react'

import { formatCurrency } from '@/lib/utils'
import { translateStorePayment } from '@/lib/i18n'

import { ResponseType as ResponseOrderType } from '@/app/(protected)/plataforma/pedidos/_features/columns'

import { useCurrentUser } from '@/features/auth/hooks/use-current-user'
import { useOpenOrder } from '@/features/foods/orders/hooks/use-open-order'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'

export const OrderReciept = () => {
  const { isOpen, order, onClose } = useOpenOrder()
  // TODO: Check get storeName method
  const { user } = useCurrentUser()

  if (!user || !order) return null

  return (
    <OrderRecieptComponent
      isOpen={isOpen}
      handleClose={onClose}
      storeName={user.selectedStore?.name!}
      order={order}
    />
  )
}

type Props = {
  order: ResponseOrderType
  storeName: string
  isOpen: boolean
  handleClose: () => void
}

const OrderRecieptComponent = ({
  isOpen,
  handleClose,
  storeName,
  order,
}: Props) => {
  const handlePrint = () => {
    window.print()
  }

  return (
    <Dialog onOpenChange={handleClose} open={isOpen}>
      <DialogContent className="max-w-lg mx-auto p-4 print:p-0">
        <DialogHeader className="flex justify-between items-center mb-4 print:hidden">
          <DialogTitle className="text-2xl font-bold">
            Pedido #{order.code}
          </DialogTitle>
          <DialogDescription>
            <Button onClick={handlePrint} className="gap-2">
              <Printer className="h-4 w-4" />
              Imprimir
            </Button>
          </DialogDescription>
        </DialogHeader>

        <Card className="print:shadow-none print:border-none">
          <CardContent className="flex flex-col gap-4">
            <div className="text-center">
              <h1 className="text-2xl font-bold">{storeName}</h1>
              {/* <p className="text-muted-foreground">WhatsApp: {storeWhatsApp}</p> */}
            </div>

            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Pedido #{order.code}</h2>
              <p className="text-sm text-muted-foreground">
                {format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm')}
              </p>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-2">Informações do Cliente</h3>
              <p>
                <span className="font-medium">Nome:</span> {order.customer.name}
              </p>
              <p>
                <span className="font-medium">WhatsApp:</span>{' '}
                {order.customer.whatsApp}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Informações de Pagamento</h3>
              <p>
                <span className="font-medium">Forma de Pagamento:</span>{' '}
                {translateStorePayment(order.payment)}
              </p>
              {!!order.moneyChange && (
                <p>
                  <span className="font-medium">Troco para:</span>{' '}
                  {formatCurrency(order.moneyChange)}
                </p>
              )}
              <p>
                <span className="font-medium">Valor Total:</span>{' '}
                {formatCurrency(order.amount)}
              </p>
            </div>

            {order.shippingRole === 'DELIVERY' && order.address && (
              <>
                <Separator />

                <div>
                  <h3 className="font-semibold mb-2">Informações de Entrega</h3>
                  <p>
                    {order.address.street}, {order.address.number}
                    {order.address.complement &&
                      `, ${order.address.complement}`}
                  </p>
                  <p>
                    {order.address.neighborhood}, {order.address.city} -{' '}
                    {order.address.state}
                  </p>
                  <p>CEP: {order.address.zipCode}</p>
                </div>
              </>
            )}

            <Separator />

            <div>
              <h3 className="font-semibold mb-2">Itens do Pedido</h3>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index}>
                    <div>
                      <p className="font-medium">
                        {item.quantity}x {item.food.name}{' '}
                      </p>
                      {item.obs && (
                        <p className="text-sm italic mt-1">Obs: {item.obs}</p>
                      )}
                    </div>

                    {item.additionals && !!item.additionals.length && (
                      <div className="mt-2">
                        <p className="text-sm">
                          <span className="font-medium">Adicionais:</span>{' '}
                          {item.additionals.map((additional, index) => (
                            <span key={index}>
                              {additional.options &&
                                !!additional.options.length &&
                                additional.options.map((option, key) => (
                                  <span key={key}>
                                    {option.quantity}x{option.option.name}
                                    {key < additional.options!.length - 1
                                      ? ', '
                                      : ''}
                                  </span>
                                ))}
                              {index < item.additionals!.length - 1 ? ', ' : ''}
                            </span>
                          ))}
                        </p>
                      </div>
                    )}

                    {!!item.food.ingredients.length && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        <p>Ingredientes: {item.food.ingredients.join(', ')}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>{formatCurrency(order.amount)}</span>
            </div>
          </CardContent>
        </Card>

        <style jsx global>{`
          @media print {
            @page {
              size: auto;
              margin: 10mm;
            }
            body {
              background: white;
            }
            .print\\:hidden {
              display: none !important;
            }
          }
        `}</style>
      </DialogContent>
    </Dialog>
  )
}
