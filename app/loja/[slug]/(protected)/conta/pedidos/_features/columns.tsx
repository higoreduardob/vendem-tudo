'use client'

import Image from 'next/image'
import { format } from 'date-fns'
import { InferResponseType } from 'hono'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, Clock, Star } from 'lucide-react'

import { client } from '@/lib/hono'
import { formatCurrency } from '@/lib/utils'
import { translateShippingRole, translateStorePayment } from '@/lib/i18n'

import { useOpenStore } from '@/hooks/use-store'
import { useNewReview } from '@/features/foods/orders/hooks/use-new-review'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { ColumnDetail } from '@/components/column-detail'
import { OrderProgress } from '@/components/order-progress'

export type ResponseType = InferResponseType<
  (typeof client.api)['food-orders']['stores'][':storeId']['$get'],
  200
>['data'][0]

export const columns: ColumnDef<ResponseType>[] = [
  {
    // TODO: hidden checkbox
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    // TODO: filter code in input
    accessorKey: 'código',
    enableHiding: false,
    header: () => null,
    cell: () => null,
  },
  {
    accessorKey: 'pagamento',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Pagamento
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="flex flex-col gap-2">
        <ColumnDetail title="Código" value={row.original.code} />

        <div className="flex flex-col">
          <ColumnDetail
            title="Entrega"
            value={translateShippingRole(row.original.shippingRole)}
          />
          <ColumnDetail
            title="Taxa da entrega"
            value={
              row.original.shipping?.fee
                ? formatCurrency(row.original.shipping?.fee)
                : 'Grátis'
            }
          />
          <ColumnDetail
            title="Forma de pagamento"
            value={translateStorePayment(row.original.payment)}
          />
          <ColumnDetail
            title="Total"
            value={formatCurrency(row.original.amount)}
          />
          {row.original.payment === 'CASH' && (
            <ColumnDetail
              title="Troco"
              value={formatCurrency(row.original.moneyChange!)}
            />
          )}
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'entrega',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Entrega
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="flex flex-col">
        {row.original.shippingRole === 'DELIVERY' ? (
          row.original?.address ? (
            <>
              <ColumnDetail
                title="Bairro"
                value={row.original.address?.neighborhood || ''}
              />
              <ColumnDetail
                title="Rua"
                value={row.original.address?.street || ''}
              />
              <ColumnDetail
                title="Número"
                value={row.original.address?.number || 'S/N'}
              />
              <ColumnDetail
                title="Cidade/UF"
                value={`${row.original.address?.city || ''}/${
                  row.original.address?.state || ''
                }`}
              />
              <ColumnDetail
                title="CEP"
                value={row.original.address?.zipCode || ''}
              />
              {row.original?.address?.complement && (
                <ColumnDetail
                  title="Complemento"
                  value={row.original.address.complement}
                />
              )}
            </>
          ) : (
            <p className="text-xs leading-tight dark:text-white">
              <span className="font-semibold">Endereço inválido</span>
            </p>
          )
        ) : (
          <p className="text-xs leading-tight dark:text-white">
            <span className="font-semibold">Retirar no local</span>
          </p>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'carrinho',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Carrinho
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const { onOpen } = useNewReview()
      const history = row.original.histories[0].orderHistory

      return (
        <div className="grid grid-cols-2 gap-4">
          {row.original.items.map((item, index) => (
            <div className="grid grid-cols-3 gap-2 items-start" key={index}>
              <div className="flex flex-col gap-2">
                <TooltipProvider>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                      <Image
                        src={item.food.image || '/placeholder.svg'}
                        alt={item.food.name}
                        width={200}
                        height={200}
                        className="h-full object-cover transition-transform hover:scale-105 rounded-md"
                      />
                    </TooltipTrigger>
                    {!!item.food.ingredients.length && (
                      <TooltipContent>
                        <div className="flex flex-col gap-1">
                          <p className="text-xs">Ingredientes</p>
                          <ul className="list-inside list-disc text-sm">
                            {item.food.ingredients.map((ingredient, index) => (
                              <li key={index}>{ingredient}</li>
                            ))}
                          </ul>
                        </div>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
                {item.obs && (
                  <ColumnDetail title="Observação" value={item.obs} />
                )}
              </div>
              <div className="col-span-2 space-y-4">
                <Button
                  variant={
                    item.reviewed || history.progress !== 'DELIVERED'
                      ? 'outline'
                      : 'red'
                  }
                  disabled={item.reviewed || history.progress !== 'DELIVERED'}
                  onClick={() => onOpen(row.original.id, item.id)}
                  className="disabled:opacity-100"
                >
                  {item.reviewed && item.review ? (
                    <>
                      <Star className="fill-yellow-400 text-yellow-400" />
                      Avaliado ({item.review})
                    </>
                  ) : (
                    'Avaliar'
                  )}
                </Button>
                <ColumnDetail
                  title={item.food.name}
                  value={`${item.quantity} unids`}
                />
                {item.additionals.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    <p className="text-sm leading-tight dark:text-white">
                      <span className="font-semibold">Adicionais</span>
                    </p>

                    {item.additionals.map((additional, key) => (
                      <div key={key}>
                        <p className="text-xs">{additional.additional.name}</p>
                        <ul>
                          {additional.options?.map((option, i) => (
                            <li
                              key={i}
                              className="list-inside text-xs list-disc text-muted-foreground"
                            >
                              <span className="font-semibold">
                                {option.option.name}:
                              </span>{' '}
                              {option.quantity} unids
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs leading-tight dark:text-white">
                    <span className="font-semibold">Sem adicionais</span>
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )
    },
  },
  {
    accessorKey: 'situação',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Situação
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const { store } = useOpenStore()
      const history = row.original.histories[0].orderHistory
      const deadlineAt = row.original.shipping?.deadlineAt
      const { createdAt, progress } = history

      if (!store) return null

      return (
        <div className="flex flex-col gap-2">
          <OrderProgress progress={progress} />

          {deadlineAt && (
            <Badge className="flex items-center gap-1 bg-green-50 text-green-700 border-green-200 hover:bg-green-100 w-fit">
              <Clock className="h-3 w-3" />
              <span>{deadlineAt} min</span>
            </Badge>
          )}

          <div>
            <ColumnDetail
              title="Hora do pedido"
              value={format(new Date(createdAt), 'HH:mm')}
            />
            <ColumnDetail
              title="Data"
              value={new Date(createdAt).toLocaleString('pt-BR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            />
            <ColumnDetail title="Contato" value={store.whatsApp!} />
          </div>
        </div>
      )
    },
  },
]
