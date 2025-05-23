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
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Todo tempo</span>
        </div>

        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 flex-1 items-center gap-4">
          <AnalyticItem
            title="Clientes"
            value={totalCustomers}
            description="Total de clientes da loja"
          />
          <AnalyticItem
            title="Ticket médio"
            value={avgTicket}
            description="Valor médio gasto pelos clientes da loja (pedidos entregues)"
          />
          <AnalyticItem
            title="Mais entregue"
            value={mostDeliveredNeighborhood}
            description="Bairro mais entregue pela loja"
          />
          <AnalyticItem
            title="Menos entregue"
            value={leastDeliveredNeighborhood}
            description="Bairro menos entregue pela loja"
          />
        </div>
      </CardContent>
    </Card>
  )
}
