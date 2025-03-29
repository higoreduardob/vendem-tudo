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
          <AnalyticItem
            title="Produtos em estoque"
            value="120"
            description=""
          />
          <AnalyticItem title="Pedidos pendentes" value="5" description="" />
          <AnalyticItem
            title="Pagamento mais utilizado"
            value="PIX"
            description=""
          />
          <AnalyticItem
            title="Vendas do dia"
            value="R$ 450,00"
            description=""
          />
        </div>
      </CardContent>
    </Card>
  )
}
