import { Calendar } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { AnalyticItem } from '@/app/(protected)/plataforma/_components/analytic-item'

type Props = {
  totalOrders: number
  pendingOrders: number
  customers: number
  dailySales: string
}

export const Analytics = ({
  totalOrders,
  pendingOrders,
  customers,
  dailySales,
}: Props) => {
  return (
    <Card>
      <CardContent className="flex items-center gap-4">
        <div className="flex items-center gap-2 border-r border-border/50 pr-4">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Hoje</span>
        </div>

        <div className="flex flex-1 items-center gap-4">
          <AnalyticItem title="Pedidos realizados" value={totalOrders} />
          <AnalyticItem title="Pedidos pendentes" value={pendingOrders} />
          <AnalyticItem title="Quantidade de clientes" value={customers} />
          <AnalyticItem title="Vendas do dia" value={dailySales} isLastItem />
        </div>
      </CardContent>
    </Card>
  )
}
