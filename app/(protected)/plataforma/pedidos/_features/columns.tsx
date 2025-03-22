'use client'

import Image from 'next/image'
import { Clock } from 'lucide-react'
import { InferResponseType } from 'hono'
import { ColumnDef } from '@tanstack/react-table'

import { OrderHistoryProgress } from '@prisma/client'

import { client } from '@/lib/hono'
import { translateOrderHistoryProgress } from '@/lib/i18n'
import { createEnumOptions, formatCurrency } from '@/lib/utils'

import { useUpdateHistory } from '@/features/foods/orders/api/use-update-history'

import { Actions } from './actions'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { SelectFilter } from '@/components/select-filter'
import { ColumnDetail } from '@/components/column-detail'

export type ResponseType = InferResponseType<
  (typeof client.api)['food-orders']['$get'],
  200
>['data'][0]

export const columns: ColumnDef<ResponseType>[] = [
  {
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
    accessorKey: 'código',
    enableHiding: false,
    header: () => null,
    cell: () => null,
  },
  {
    accessorKey: 'pagamento',
    header: () => {
      return <Button variant="ghost">Pagamento</Button>
    },
    cell: ({ row }) => (
      <div className="flex flex-col gap-2">
        <ColumnDetail title="Código" value={row.original.code} />

        <div className="flex flex-col">
          <ColumnDetail title="Cliente" value={row.original.customer.name} />
          <ColumnDetail
            title="WhatsApp"
            value={row.original.customer.whatsApp}
          />
          <ColumnDetail title="Email" value={row.original.customer.email} />
        </div>
        <div className="flex flex-col">
          <ColumnDetail title="Entrega" value={row.original.shippingRole} />
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
            value={row.original.payment}
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
    header: () => {
      return <Button variant="ghost">Entrega</Button>
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
    header: () => {
      return <Button variant="ghost">Carrinho</Button>
    },
    cell: ({ row }) => (
      <div className="grid grid-cols-3 gap-4">
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
                  <TooltipContent className="max-w-xs">
                    <div className="flex flex-col gap-1">
                      <p className="text-xs">Ingredientes</p>
                      <span className="text-muted-foreground text-xs">
                        {item.food.ingredients.join(', ')}
                      </span>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              {item.obs && <ColumnDetail title="Observação" value={item.obs} />}
            </div>
            <div className="col-span-2 space-y-4">
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
    ),
  },
  {
    accessorKey: 'situação',
    header: () => {
      return <Button variant="ghost">Situação</Button>
    },
    cell: ({ row }) => {
      const mutation = useUpdateHistory(row.original.id)
      const isPending = mutation.isPending

      const history = row.original.histories[0].orderHistory
      const deadlineAt = row.original.shipping?.deadlineAt
      const { createdAt, progress } = history

      const progressOptions: FilterOptionsProps = createEnumOptions(
        OrderHistoryProgress,
        (key) => translateOrderHistoryProgress(key as OrderHistoryProgress)
      )

      const onChange = (progress: OrderHistoryProgress) => {
        mutation.mutate({ progress })
      }

      return (
        <div className="flex flex-col gap-2">
          <SelectFilter
            placeholder="Selecione o método"
            defaultValue={progress}
            value={progress}
            data={progressOptions}
            isDisabled={isPending}
            onChange={onChange}
            className="w-full"
          />

          {deadlineAt && (
            <Badge className="flex items-center gap-1 bg-green-50 text-green-700 border-green-200 hover:bg-green-100 w-fit">
              <Clock className="h-3 w-3" />
              <span>{deadlineAt} min</span>
            </Badge>
          )}

          <div>
            <ColumnDetail
              title="Hora do pedido"
              value={new Date(createdAt).toLocaleTimeString()}
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
          </div>
        </div>
      )
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => <Actions id={row.original.id} />,
  },
]
