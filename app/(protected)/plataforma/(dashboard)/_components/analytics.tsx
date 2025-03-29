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
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Hoje</span>
        </div>

        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 flex-1 items-center gap-4">
          <AnalyticItem
            title="Pedidos"
            value={totalOrders}
            description="Total de pedidos realizados hoje"
          />
          <AnalyticItem
            title="Pendentes"
            value={pendingOrders}
            description="Total de pedidos pendentes de hoje"
          />
          <AnalyticItem
            title="Clientes"
            value={customers}
            description="Total de clientes da loja"
          />
          <AnalyticItem
            title="Vendas"
            value={dailySales}
            description="Total de vendas realziadas hoje canceladas ou faturadas"
          />
        </div>
      </CardContent>
    </Card>
  )
}
