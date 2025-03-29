import { Calendar } from 'lucide-react'
import { InferResponseType } from 'hono'

import { client } from '@/lib/hono'

import { Card, CardContent } from '@/components/ui/card'
import { AnalyticItem } from '@/app/(protected)/plataforma/_components/analytic-item'

type Props = Omit<
  InferResponseType<
    (typeof client.api)['foods']['analytics']['$get'],
    200
  >['data'],
  'totalRevenue'
> & {
  totalRevenue: string
}

export const Analytics = ({
  mostSoldProduct,
  leastSoldProduct,
  bestRatedProduct,
  totalRevenue,
}: Props) => {
  return (
    <Card>
      <CardContent className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Todo tempo</span>
        </div>

        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 flex-1 items-center gap-4">
          <AnalyticItem
            title="Faturamento"
            value={totalRevenue}
            description="Total de valor realmente vendido e faturado (pedidos entregues)"
          />
          <AnalyticItem
            title="Mais vendido"
            value={mostSoldProduct}
            description="Produto mais vendido"
          />
          <AnalyticItem
            title="Menos vendido"
            value={leastSoldProduct}
            description="Produto menos vendido"
          />
          <AnalyticItem
            title="Mais avaliado"
            value={bestRatedProduct}
            description="Produto com maior avaliação"
          />
        </div>
      </CardContent>
    </Card>
  )
}
