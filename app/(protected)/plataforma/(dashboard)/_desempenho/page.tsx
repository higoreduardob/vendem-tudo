'use client'

import { useGetOverview } from '@/features/foods/orders/api/use-get-overview'

import { PieVariant } from '@/components/pie-variant'
// import { BarVariant } from '@/components/bar-variant'
import { LineVariant } from '@/components/line-variant'
import { AreaVariant } from '@/components/area-variant'
import { RadarVariant } from '@/components/radar-variant'
import { Title } from '@/app/(protected)/_components/title'
import { WrapperVariant } from '@/app/(protected)/plataforma/_components/wrapper-variant'
import { Analytics } from '@/app/(protected)/plataforma/(dashboard)/_desempenho/_components/analytics'

const Options = () => (
  <div className="flex flex-col items-end">
    <div className="text-xs text-emerald-400">+47,93%*</div>
    <div className="text-2xl font-bold">R$ 145.231,89</div>
  </div>
)

export default function OverviewPage() {
  const overviewsQuery = useGetOverview()
  const overviews = overviewsQuery.data

  const isLoading = overviewsQuery.isLoading

  // TODO: Add skeleton
  if (isLoading) {
    return <>Skeleton</>
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <Title>Desempenho</Title>
      <Analytics />
      {/* TODO: Change charts rules */}
      <div className="grid grid-cols-5 gap-4">
        <WrapperVariant title="Pedidos" options={<Options />}>
          <AreaVariant
            data={overviews?.dailyMetrics || []}
            fields={[
              {
                key: 'count',
                color: 'hsl(var(--chart-1))',
                label: 'Pedidos',
              },
            ]}
          />
        </WrapperVariant>
        <WrapperVariant title="Vendidos" options={<Options />}>
          <AreaVariant
            data={overviews?.dailyMetrics || []}
            fields={[
              {
                key: 'delivered',
                color: 'hsl(var(--chart-2))',
                label: 'Vendas',
              },
            ]}
          />
        </WrapperVariant>
        <WrapperVariant title="Canceladas" options={<Options />}>
          <AreaVariant
            data={overviews?.dailyMetrics || []}
            fields={[
              {
                key: 'cancelled',
                color: 'hsl(var(--chart-3))',
                label: 'Canceladas',
              },
            ]}
          />
        </WrapperVariant>
        <WrapperVariant title="Faturamento" options={<Options />}>
          <AreaVariant
            data={overviews?.dailyMetrics || []}
            fields={[
              {
                key: 'invoicing',
                color: 'hsl(var(--chart-4))',
                label: 'Faturamento',
              },
            ]}
          />
        </WrapperVariant>
        <WrapperVariant title="Ticket médio" options={<Options />}>
          <AreaVariant
            data={overviews?.dailyMetrics || []}
            fields={[
              {
                key: 'avgTicket',
                color: 'hsl(var(--chart-5))',
                label: 'Ticket médio',
              },
            ]}
          />
        </WrapperVariant>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <WrapperVariant title="Métodos de pagamento">
          <PieVariant
            data={overviews?.paymentMethods || []}
            fields={
              overviews?.paymentMethods && overviews?.paymentMethods.length > 0
                ? [
                    ...overviews.paymentMethods.map((_, index) => ({
                      key: `payment`,
                      color: `hsl(var(--chart-${index}))`,
                      label: 'Quantidade',
                    })),
                    {
                      key: 'count',
                      color: 'hsl(var(--chart-1))',
                      label: 'Quantidade',
                    },
                  ]
                : []
            }
          />
        </WrapperVariant>
        {/* TODO: Fix error quantity elements */}
        <WrapperVariant title="Mais vendidos">
          <PieVariant
            data={overviews?.topProducts || []}
            fields={
              overviews?.topProducts && overviews?.topProducts.length > 0
                ? [
                    ...overviews.topProducts.map((_, index) => ({
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
        <WrapperVariant title="Carrinhos abandonados" options={<Options />}>
          <LineVariant />
        </WrapperVariant>
        <WrapperVariant title="Horários">
          <RadarVariant />
        </WrapperVariant>
      </div>
    </div>
  )
}
