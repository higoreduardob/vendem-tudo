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
        <div className="flex items-center gap-2 border-r border-border/50 pr-4">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Todo tempo</span>
        </div>

        <div className="flex flex-1 items-center gap-4">
          <AnalyticItem
            title="Categoria mais vendida"
            value={mostSoldCategory}
          />
          <AnalyticItem
            title="Categoria menos vendida"
            value={leastSoldCategory}
            isLastItem
          />
        </div>
      </CardContent>
    </Card>
  )
}
