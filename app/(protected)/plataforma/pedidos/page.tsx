'use client'

import { columns } from './_features/columns'

import { useGetOrders } from '@/features/foods/orders/api/use-get-orders'
import { useFilterOrder } from '@/features/foods/orders/hooks/use-filter-order'

import { DataTable } from '@/components/data-table'
import { Title } from '@/app/(protected)/_components/title'
import { Actions } from '@/app/(protected)/plataforma/pedidos/_components/actions'
import { Analytics } from '@/app/(protected)/plataforma/pedidos/_components/analytics'

export default function OrdersPage() {
  const ordersQuery = useGetOrders()
  const orders = ordersQuery.data || []
  const { onChangeStatus } = useFilterOrder()

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <Title>Pedidos</Title>
        <Actions />
      </div>
      <Analytics />
      <DataTable
        filterKey="código"
        placeholder="pedido"
        columns={columns}
        data={orders}
        onDelete={(row) => {
          const ids = row.map((r) => r.original.id)
          console.log({ ids })
        }}
        onChangeStatus={onChangeStatus}
      />
    </div>
  )
}
