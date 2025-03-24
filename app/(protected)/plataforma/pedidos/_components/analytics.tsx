import { Calendar } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { AnalyticItem } from '@/app/(protected)/plataforma/_components/analytic-item'

type Props = {
  averageTicket: string
  totalRevenue: string
  totalOrders: number
  totalCancelled: number
}

export const Analytics = ({
  averageTicket,
  totalRevenue,
  totalOrders,
  totalCancelled,
}: Props) => {
  return (
    <Card>
      <CardContent className="flex items-center gap-4">
        <div className="flex items-center gap-2 border-r border-border/50 pr-4">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Hoje</span>
        </div>

        <div className="flex flex-1 items-center gap-4">
          <AnalyticItem title="Total de pedidos" value={totalOrders} />
          <AnalyticItem title="Total de cancelados" value={totalCancelled} />
          <AnalyticItem title="Total de faturamento" value={totalRevenue} />
          <AnalyticItem title="Ticket médio" value={averageTicket} isLastItem />
        </div>
      </CardContent>
    </Card>
  )
}
