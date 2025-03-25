import { Calendar } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { AnalyticItem } from '@/app/(protected)/plataforma/_components/analytic-item'

type Props = {
  totalCustomers: number
  avgTicket: string
  mostDeliveredNeighborhood: string
  leastDeliveredNeighborhood: string
}

export const Analytics = ({
  totalCustomers,
  avgTicket,
  mostDeliveredNeighborhood,
  leastDeliveredNeighborhood,
}: Props) => {
  return (
    <Card>
      <CardContent className="flex items-center gap-4">
        <div className="flex items-center gap-2 border-r border-border/50 pr-4">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Todo tempo</span>
        </div>

        <div className="flex flex-1 items-center gap-4">
          <AnalyticItem title="Total de clientes" value={totalCustomers} />
          <AnalyticItem title="Ticket médio" value={avgTicket} />
          <AnalyticItem
            title="Bairro mais entregue"
            value={mostDeliveredNeighborhood}
          />
          <AnalyticItem
            title="Bairro menos entregue"
            value={leastDeliveredNeighborhood}
            isLastItem
          />
        </div>
      </CardContent>
    </Card>
  )
}
