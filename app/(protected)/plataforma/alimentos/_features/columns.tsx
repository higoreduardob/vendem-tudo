'use client'

import { InferResponseType } from 'hono'
import { ArrowUpDown } from 'lucide-react'
import { ColumnDef } from '@tanstack/react-table'

import { client } from '@/lib/hono'

import { formatCurrency } from '@/lib/utils'

import { Actions } from '@/app/(protected)/plataforma/alimentos/_features/actions'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { ImageSlider } from '@/components/image-slider'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ColumnDetail } from '@/components/column-detail'

export type ResponseType = InferResponseType<
  typeof client.api.foods.$get,
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
    accessorKey: 'imagens',
    header: () => {
      return <Button variant="ghost">Imagens</Button>
    },
    cell: ({ row }) => (
      <ImageSlider images={[row.original.image]} product={row.original.name} />
    ),
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
          Produto
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'preço',
    header: () => {
      return <Button variant="ghost">Preço</Button>
    },
    cell: ({ row }) => (
      <div className="flex flex-col gap-2">
        <ColumnDetail
          title="Original"
          value={`${formatCurrency(row.original.price)}`}
        />
        {row.original.promotion ? (
          <ColumnDetail
            title="Promocional"
            value={`${formatCurrency(row.original.promotion)}`}
          />
        ) : (
          <></>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'categoria',
    header: () => {
      return <Button variant="ghost">Categoria</Button>
    },
    cell: ({ row }) => row.original.category.name,
  },
  {
    accessorKey: 'vendas',
    header: () => {
      return <Button variant="ghost">Vendas</Button>
    },
    cell: ({ row }) => {
      const sales = row.original._count.items

      return (
        <span className="text-muted-foreground text-sm">
          {sales ? `${sales} unids` : 'Nenhum registro cadastro'}
        </span>
      )
    },
  },
  {
    accessorKey: 'avaliações',
    header: () => {
      return <Button variant="ghost">Avaliações</Button>
    },
    cell: ({ row }) => {
      const reviews = row.original.reviewsAmount
      const avg = row.original.reviewsAvg

      return (
        <span className="text-muted-foreground text-sm">
          {reviews && avg
            ? `${reviews} (${avg} ★)`
            : 'Nenhum registro cadastro'}
        </span>
      )
    },
  },
  {
    accessorKey: 'ingredientes',
    header: () => {
      return <Button variant="ghost">Ingredientes</Button>
    },
    cell: ({ row }) => {
      const ingredients = row.original.ingredients
      return (
        <ScrollArea className="max-h-[100px] overflow-y-auto">
          <div className="flex flex-col">
            {ingredients.length > 0 ? (
              ingredients.map((ingredient, index) => (
                <span key={index} className="text-muted-foreground text-xs">
                  {ingredient}
                </span>
              ))
            ) : (
              <span className="text-muted-foreground text-sm">
                Nenhum registro cadastro
              </span>
            )}
          </div>
        </ScrollArea>
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
