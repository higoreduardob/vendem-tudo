import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useQuery } from '@tanstack/react-query'

import { client } from '@/lib/hono'
import { convertAmountFromMiliunits, formatCurrency } from '@/lib/utils'

export const useGetSummary = () => {
  const query = useQuery({
    queryKey: ['orders-summary'],
    queryFn: async () => {
      const response = await client.api['food-orders'].summary.$get({})

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Falha para obter as análises')
      }

      const { data } = await response.json()
      return {
        ...data,
        summary: data.summary.map((summary) => ({
          ...summary,
          date: format(new Date(summary.date + 'T00:00:00'), 'dd MMM', {
            locale: ptBR,
          }),
          invoicing: convertAmountFromMiliunits(summary.invoicing),
          total: convertAmountFromMiliunits(summary.total),
        })),
        overview: {
          ...data.overview,
          dailySales: formatCurrency(
            convertAmountFromMiliunits(data.overview.dailySales)
          ),
        },
      }
    },
  })

  return query
}
