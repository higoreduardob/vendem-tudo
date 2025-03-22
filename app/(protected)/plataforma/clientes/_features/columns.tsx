'use client'

import { InferResponseType } from 'hono'
import { ArrowUpDown } from 'lucide-react'
import { ColumnDef } from '@tanstack/react-table'

import { client } from '@/lib/hono'
import { cpfCnpjMask, phoneMask, zipCodeMask } from '@/lib/format'

import { Actions } from '@/app/(protected)/plataforma/clientes/_features/actions'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

export type ResponseType = InferResponseType<
  typeof client.api.users.$get,
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
          Cliente
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'whatsApp',
    header: () => {
      return <Button variant="ghost">WhatsApp</Button>
    },
    cell: ({ row }) => phoneMask(row.original.whatsApp),
  },
  {
    accessorKey: 'email',
    header: () => {
      return <Button variant="ghost">Email</Button>
    },
  },
  {
    accessorKey: 'CPF/CNPJ',
    header: () => {
      return <Button variant="ghost">CPF/CNPJ</Button>
    },
    cell: ({ row }) => cpfCnpjMask(row.original.cpfCnpj),
  },
  {
    accessorKey: 'endereço',
    header: () => {
      return <Button variant="ghost">Endereço</Button>
    },
    cell: ({ row }) => (
      <div className="flex flex-col">
        <p className="text-sm">
          <span className="font-semibold">Bairro: </span>
          {row.original?.address?.neighborhood}
        </p>
        <p className="text-sm">
          <span className="font-semibold">Rua: </span>
          {row.original?.address?.street}
        </p>
        <p className="text-sm">
          <span className="font-semibold">Número: </span>
          {row.original?.address?.number || 'S/N'}
        </p>
        <p className="text-sm">
          <span className="font-semibold">Cidade/UF: </span>
          {row.original?.address?.city}/{row.original?.address?.state}
        </p>
        <p className="text-sm">
          <span className="font-semibold">CEP: </span>
          {zipCodeMask(row.original?.address?.zipCode)}
        </p>
        {row.original?.address?.complement && (
          <p className="text-sm">
            <span className="font-semibold">Complemento: </span>
            {row.original?.address?.complement}
          </p>
        )}
      </div>
    ),
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => (
      <Actions status={row.original.status} id={row.original.id} />
    ),
  },
]
