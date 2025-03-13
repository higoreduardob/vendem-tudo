import { Calendar } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { AnalyticItem } from '@/app/(protected)/plataforma/_components/analytic-item'

export const Analytics = () => {
  return (
    <Card>
      <CardContent className="flex items-center gap-4">
        <div className="flex items-center gap-2 border-r border-border/50 pr-4">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Hoje</span>
        </div>

        <div className="flex flex-1 items-center gap-4">
          <AnalyticItem title="Total de pedidos" value="30" />
          <AnalyticItem title="Cancelados" value="4" />
          <AnalyticItem title="Ticket médio" value="R$ 180,00" />
          <AnalyticItem title="Tempo médio de entrega" value="2h" isLastItem />
        </div>
      </CardContent>
    </Card>
  )
}
