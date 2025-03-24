import { useQuery } from '@tanstack/react-query'

import { client } from '@/lib/hono'
import { convertAmountFromMiliunits, formatCurrency } from '@/lib/utils'

export const useGetAnalytics = () => {
  const query = useQuery({
    queryKey: ['orders-analytics'],
    queryFn: async () => {
      const response = await client.api['customers'].analytics.$get({})

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Falha para obter as análises')
      }

      const { data } = await response.json()
      return {
        ...data,
        avgTicket: formatCurrency(convertAmountFromMiliunits(data.avgTicket)),
      }
    },
  })

  return query
}
