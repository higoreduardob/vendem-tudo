import { Calendar } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { AnalyticItem } from '@/app/(protected)/plataforma/_components/analytic-item'

type Props = {
  mostSoldProduct: {
    id: string
    name: string
    sales: number
  }
  leastSoldProduct: {
    id: string
    name: string
    sales: number
  }
  totalRevenue: string
}

export const Analytics = ({
  totalRevenue,
  mostSoldProduct,
  leastSoldProduct,
}: Props) => {
  return (
    <Card>
      <CardContent className="flex items-center gap-4">
        <div className="flex items-center gap-2 border-r border-border/50 pr-4">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Hoje</span>
        </div>

        <div className="flex flex-1 items-center gap-4">
          <AnalyticItem title="Faturamento total" value={totalRevenue} />
          <AnalyticItem
            title="Produto mais vendido"
            value={mostSoldProduct.name}
          />
          <AnalyticItem
            title="Produto menos vendido"
            value={leastSoldProduct.name}
          />
          {/* TODO: Add most reviewd */}
          <AnalyticItem title="Mais avaliado" value="35%" isLastItem />
        </div>
      </CardContent>
    </Card>
  )
}
