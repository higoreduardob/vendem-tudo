'use client'

import { columns } from './_features/columns'

import { useOpenStore } from '@/hooks/use-store'
import { useGetStoreOrders } from '@/features/foods/orders/api/use-get-orders'
import { useFilterOrder } from '@/features/foods/orders/hooks/use-filter-order'

import { DataTable } from '@/components/data-table'
import { Title } from '@/app/(protected)/_components/title'

export default function OrdersPage() {
  const { store } = useOpenStore()
  const ordersQuery = useGetStoreOrders(store?.id)
  const orders = ordersQuery.data || []
  const { onChangeStatus } = useFilterOrder()

  console.log(orders)

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <Title>Pedidos</Title>
      </div>
      <DataTable
        filterKey="código"
        placeholder="código"
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
