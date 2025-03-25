'use client'

import { OrderHistoryProgress } from '@prisma/client'

import { columns } from '@/app/(protected)/plataforma/pedidos/_features/columns'

import { createEnumOptions } from '@/lib/utils'
import { translateOrderHistoryProgress } from '@/lib/i18n'

import { useGetOrders } from '@/features/foods/orders/api/use-get-orders'
import { useGetSummary } from '@/features/foods/orders/api/use-get-summary'
import { useFilterOrder } from '@/features/foods/orders/hooks/use-filter-order'

import { DataTable } from '@/components/data-table'
import { PieVariant } from '@/components/pie-variant'
import { Title } from '@/app/(protected)/_components/title'
import { ChartVariant } from '@/app/(protected)/plataforma/_components/chart-variant'
import { WrapperVariant } from '@/app/(protected)/plataforma/_components/wrapper-variant'
import { Analytics } from '@/app/(protected)/plataforma/(dashboard)/_components/analytics'

export default function DashboardPage() {
  const ordersQuery = useGetOrders(true)
  const orders = ordersQuery.data || []
  const summaryQuery = useGetSummary()
  const summary = summaryQuery.data

  const { onChangeStatus, status } = useFilterOrder()

  const isLoading = ordersQuery.isLoading || summaryQuery.isLoading

  const progressOptions: FilterOptionsProps = [
    { label: 'Todos', value: undefined },
    ...createEnumOptions(OrderHistoryProgress, (key) =>
      translateOrderHistoryProgress(key as OrderHistoryProgress)
    ),
  ]

  // TODO: Add skeleton
  if (isLoading) {
    return <div className="w-full flex flex-col gap-4">Skeleton</div>
  }

  if (!summary) return null

  return (
    <div className="w-full flex flex-col gap-4">
      <Title>Painel</Title>
      <Analytics {...summary.overview} />
      <div className="grid grid-cols-3 gap-4">
        <ChartVariant
          title="Movimentações"
          data={summary.summary || []}
          fields={[
            {
              key: 'count',
              color: 'hsl(var(--chart-1))',
              label: 'Pedidos',
            },
            {
              key: 'delivered',
              color: 'hsl(var(--chart-3))',
              label: 'Entregas',
            },
            {
              key: 'cancelled',
              color: 'hsl(var(--chart-4))',
              label: 'Canceladas',
            },
          ]}
        />
        <ChartVariant
          title="Financeiro"
          data={summary.summary || []}
          fields={[
            {
              key: 'total',
              color: 'hsl(var(--chart-2))',
              label: 'Vendas',
            },
            {
              key: 'invoicing',
              color: 'hsl(var(--chart-5))',
              label: 'Faturamento',
            },
          ]}
        />
        <WrapperVariant title="Mais vendidos">
          <PieVariant
            data={summary.mostSales || []}
            fields={
              !!summary.mostSales.length
                ? [
                    ...summary.mostSales.map((_, index) => ({
                      key: `name`,
                      color: `hsl(var(--chart-${index}))`,
                      label: 'Quantidade',
                    })),
                    {
                      key: 'quantity',
                      color: 'hsl(var(--chart-1))',
                      label: 'Quantidade',
                    },
                  ]
                : []
            }
          />
        </WrapperVariant>
      </div>
      <DataTable
        filterKey="código"
        placeholder="código"
        data={orders}
        columns={columns}
        status={status}
        statusFilter={progressOptions}
        onChangeStatus={onChangeStatus}
        onDelete={(row) => {
          const ids = row.map((r) => r.original.id)
          console.log({ ids })
        }}
      />
    </div>
  )
}
