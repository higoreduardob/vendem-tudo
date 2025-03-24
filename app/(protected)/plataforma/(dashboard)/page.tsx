'use client'

import { columns } from '@/app/(protected)/plataforma/pedidos/_features/columns'

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
  const { onChangeStatus, status } = useFilterOrder()
  const ordersQuery = useGetOrders(true)
  const orders = ordersQuery.data || []
  const summary = useGetSummary()

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Title>Painel</Title>
        {/* Actions */}
      </div>
      <Analytics {...summary.data?.overview!} />
      <div className="grid grid-cols-3 gap-4">
        <ChartVariant
          title="Movimentações"
          data={summary.data?.summary || []}
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
          data={summary.data?.summary || []}
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
            data={summary.data?.mostSales || []}
            fields={
              summary.data?.mostSales && summary.data?.mostSales.length > 0
                ? [
                    ...summary.data.mostSales.map((_, index) => ({
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
      {/* TODO: Change filter status options */}
      <DataTable
        filterKey="código"
        placeholder="pedido"
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
