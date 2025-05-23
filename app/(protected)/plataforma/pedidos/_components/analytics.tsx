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
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Todo tempo</span>
        </div>

        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 flex-1 items-center gap-4">
          <AnalyticItem
            title="Pedidos"
            value={totalOrders}
            description="Total de pedidos realizados"
          />
          <AnalyticItem
            title="Cancelados"
            value={totalCancelled}
            description="Total de pedidos cancelados"
          />
          <AnalyticItem
            title="Faturamento"
            value={totalRevenue}
            description="Total de pedidos vendidos (entregues)"
          />
          <AnalyticItem
            title="Ticket médio"
            value={averageTicket}
            description="Valor médio por pedido entregues pela loja"
          />
        </div>
      </CardContent>
    </Card>
  )
}
