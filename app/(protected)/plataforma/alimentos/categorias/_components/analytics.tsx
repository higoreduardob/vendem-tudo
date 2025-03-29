import { Calendar } from 'lucide-react'
import { InferResponseType } from 'hono'

import { client } from '@/lib/hono'

import { Card, CardContent } from '@/components/ui/card'
import { AnalyticItem } from '@/app/(protected)/plataforma/_components/analytic-item'

type Props = InferResponseType<
  (typeof client.api)['food-categories']['analytics']['$get'],
  200
>['data']

export const Analytics = ({ mostSoldCategory, leastSoldCategory }: Props) => {
  return (
    <Card>
      <CardContent className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Todo tempo</span>
        </div>

        <div className="grid grid-cols-1 xs:grid-cols-2 flex-1 items-center gap-4">
          <AnalyticItem
            title="Mais vendida"
            value={mostSoldCategory}
            description="Categoria mais vendida"
          />
          <AnalyticItem
            title="Menos vendida"
            value={leastSoldCategory}
            description="Categoria menos vendida"
          />
        </div>
      </CardContent>
    </Card>
  )
}
