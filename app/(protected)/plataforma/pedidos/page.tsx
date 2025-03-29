'use client'

import { OrderHistoryProgress } from '@prisma/client'

import { columns } from '@/app/(protected)/plataforma/pedidos/_features/columns'

import { createEnumOptions } from '@/lib/utils'
import { translateOrderHistoryProgress } from '@/lib/i18n'

import { useGetOrders } from '@/features/foods/orders/api/use-get-orders'
import { useFilterOrder } from '@/features/foods/orders/hooks/use-filter-order'
import { useGetAnalytics } from '@/features/foods/orders/api/use-get-analytics'

import { Skeleton } from '@/components/ui/skeleton'
import { Title } from '@/app/(protected)/_components/title'
import { DataTable, DataTableLoading } from '@/components/data-table'
import { Actions } from '@/app/(protected)/plataforma/pedidos/_components/actions'
import { Analytics } from '@/app/(protected)/plataforma/pedidos/_components/analytics'

export default function OrdersPage() {
  const ordersQuery = useGetOrders()
  const orders = ordersQuery.data || []
  const analyticsQuery = useGetAnalytics()
  const analytics = analyticsQuery.data

  const { status, onChangeStatus } = useFilterOrder()

  const isLoading = ordersQuery.isLoading || analyticsQuery.isLoading

  const progressOptions: FilterOptionsProps = [
    { label: 'Todos', value: undefined },
    ...createEnumOptions(OrderHistoryProgress, (key) =>
      translateOrderHistoryProgress(key as OrderHistoryProgress)
    ),
  ]

  if (isLoading) {
    return (
      <div className="w-full flex flex-col gap-4">
        <Skeleton className="h-[30px] w-[300px]" />
        <Skeleton className="h-[80px] w-full" />
        <DataTableLoading />
      </div>
    )
  }

  if (!analytics) return null

  return (
    <div className="w-full flex flex-col gap-4">
      <Title>Pedidos</Title>
      <Analytics {...analytics} />
      <DataTable
        filterKey="code"
        placeholder="código"
        data={orders}
        columns={columns}
        status={status}
        statusFilter={progressOptions}
        onChangeStatus={onChangeStatus}
        filters={<Actions />}
        onDelete={(row) => {
          const ids = row.map((r) => r.original.id)
          console.log({ ids })
        }}
      />
    </div>
  )
}
