import { useQuery } from '@tanstack/react-query'

import { client } from '@/lib/hono'
import { convertAmountFromMiliunits, formatCurrency } from '@/lib/utils'

export const useGetAnalytics = () => {
  const query = useQuery({
    queryKey: ['orders-analytics'],
    queryFn: async () => {
      const response = await client.api['food-orders'].analytics.$get({})

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Falha para obter as análises')
      }

      const { data } = await response.json()
      return {
        ...data,
        averageTicket: formatCurrency(
          convertAmountFromMiliunits(data.averageTicket)
        ),
        totalRevenue: formatCurrency(
          convertAmountFromMiliunits(data.totalRevenue)
        ),
      }
    },
    refetchInterval: 5 * 1000, // TODO: Create webhook
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
  })

  return query
}
