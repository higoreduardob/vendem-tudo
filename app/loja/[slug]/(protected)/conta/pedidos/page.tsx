'use client'

import { columns } from '@/app/loja/[slug]/(protected)/conta/pedidos/_features/columns'

import { useOpenStore } from '@/hooks/use-store'
import { useGetStoreOrders } from '@/features/foods/orders/api/use-get-orders'
import { useFilterOrder } from '@/features/foods/orders/hooks/use-filter-order'

import { Skeleton } from '@/components/ui/skeleton'
import { Title } from '@/app/(protected)/_components/title'
import { DataTable, DataTableLoading } from '@/components/data-table'

export default function OrdersPage() {
  const { store } = useOpenStore()
  const { onChangeStatus, status } = useFilterOrder()
  const ordersQuery = useGetStoreOrders(store?.id)
  const orders = ordersQuery.data || []

  const isLoading = ordersQuery.isLoading

  if (isLoading) {
    return (
      <div className="w-full flex flex-col gap-4">
        <Skeleton className="h-[30px] w-[300px]" />
        <DataTableLoading />
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <Title>Pedidos</Title>
      <DataTable
        filterKey="code"
        placeholder="código"
        columns={columns}
        data={orders}
        onDelete={(row) => {
          const ids = row.map((r) => r.original.id)
          console.log({ ids })
        }}
        status={status}
        onChangeStatus={onChangeStatus}
      />
    </div>
  )
}
