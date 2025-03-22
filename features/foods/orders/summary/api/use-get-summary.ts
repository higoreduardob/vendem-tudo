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
          invoicing: formatCurrency(
            convertAmountFromMiliunits(summary.invoicing)
          ),
          total: formatCurrency(convertAmountFromMiliunits(summary.total)),
        })),
      }
    },
  })

  return query
}
