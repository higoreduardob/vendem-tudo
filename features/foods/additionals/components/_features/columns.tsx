'use client'

import { InferResponseType } from 'hono'
import { ArrowUpDown } from 'lucide-react'
import { ColumnDef } from '@tanstack/react-table'

import { client } from '@/lib/hono'

import { Actions } from '@/features/foods/additionals/components/_features/actions'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

export type ResponseType = InferResponseType<
  (typeof client.api)['food-additionals']['$get'],
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
    accessorKey: 'name',
    enableHiding: false,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Adicional
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'descrição',
    header: () => {
      return <Button variant="ghost">Descrição</Button>
    },
    cell: ({ row }) => row.original.description,
  },
  {
    accessorKey: 'opções',
    header: () => {
      return <Button variant="ghost">Opções</Button>
    },
    cell: ({ row }) => {
      const options = row.original.options
        .map((option) => option.foodOption.name)
        .join(', ')

      return options.length > 0 ? (
        <span className="text-muted-foreground text-xs">{options}</span>
      ) : (
        <span className="text-muted-foreground text-sm">
          Nenhum registro cadastro
        </span>
      )
    },
  },
  {
    accessorKey: 'produtos',
    header: () => {
      return <Button variant="ghost">Produtos</Button>
    },
    cell: ({ row }) => {
      const products = row.original._count.foods

      return (
        <span className="text-muted-foreground text-sm">
          {products ? `${products} unids` : 'Nenhum registro cadastro'}
        </span>
      )
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => (
      <Actions status={row.original.status} id={row.original.id} />
    ),
  },
]
