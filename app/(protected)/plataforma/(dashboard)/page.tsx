'use client'

import { columns } from '@/app/(protected)/plataforma/pedidos/_features/columns'

import { useGetOrders } from '@/features/foods/orders/api/use-get-orders'
import { useFilterOrder } from '@/features/foods/orders/hooks/use-filter-order'

import { AreaVariant } from '@/components/area-variant'
import { Title } from '@/app/(protected)/_components/title'
import { WrapperVariant } from '../_components/wrapper-variant'
import { Analytics } from './_components/analytics'
import { DataTable } from '@/components/data-table'
import { BarVariant } from '@/components/bar-variant'

import { PieVariant } from '@/components/pie-variant'
import { useGetSummary } from '@/features/foods/orders/summary/api/use-get-summary'
import { InferResponseType } from 'hono'
import { client } from '@/lib/hono'
import { RadarVariant } from '@/components/radar-variant'

export type SummaryResponseType = InferResponseType<
  (typeof client.api)['food-orders']['summary']['$get'],
  200
>['data']['summary'][0]

export default function DashboardPage() {
  const ordersQuery = useGetOrders()
  const orders = ordersQuery.data || []
  const { onChangeStatus } = useFilterOrder()
  const summary = useGetSummary()

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Title>Painel</Title>
        {/* Actions */}
      </div>
      <Analytics />
      <div className="grid grid-cols-4 gap-4">
        <WrapperVariant title="Movimentações">
          <AreaVariant
            data={summary.data?.summary || []}
            fields={[
              {
                key: 'count',
                color: 'hsl(var(--chart-1))',
                label: 'Pedidos',
              },
              {
                key: 'total',
                color: 'hsl(var(--chart-2))',
                label: 'Vendas',
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
              {
                key: 'invoicing',
                color: 'hsl(var(--chart-5))',
                label: 'Faturamento',
              },
            ]}
          />
        </WrapperVariant>
        <WrapperVariant title="Cancelamentos">
          <BarVariant
            data={summary.data?.summary || []}
            fields={[
              {
                key: 'count',
                color: 'hsl(var(--chart-1))',
                label: 'Pedidos',
              },
              {
                key: 'total',
                color: 'hsl(var(--chart-2))',
                label: 'Vendas',
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
              {
                key: 'invoicing',
                color: 'hsl(var(--chart-5))',
                label: 'Faturamento',
              },
            ]}
          />
        </WrapperVariant>
        <WrapperVariant title="Faturamento">
          <RadarVariant />
        </WrapperVariant>
        <WrapperVariant title="Mais vendidos">
          <PieVariant
            data={summary.data?.mostSales || []}
            fields={[
              {
                key: 'quantity',
                color: 'hsl(var(--chart-1))',
                label: 'Quantidade',
              },
              {
                key: 'name',
                color: 'hsl(var(--chart-2))',
                label: 'Quantidade',
              },
            ]}
          />
        </WrapperVariant>
      </div>
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
