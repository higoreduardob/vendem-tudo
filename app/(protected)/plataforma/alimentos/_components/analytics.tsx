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
        <div className="flex items-center gap-2 border-r border-border/50 pr-4">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Todo tempo</span>
        </div>

        <div className="flex flex-1 items-center gap-4">
          <AnalyticItem title="Faturamento total" value={totalRevenue} />
          <AnalyticItem title="Produto mais vendido" value={mostSoldProduct} />
          <AnalyticItem
            title="Produto menos vendido"
            value={leastSoldProduct}
          />
          <AnalyticItem
            title="Mais avaliado"
            value={bestRatedProduct}
            isLastItem
          />
        </div>
      </CardContent>
    </Card>
  )
}
