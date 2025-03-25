import { useQuery } from '@tanstack/react-query'

import { client } from '@/lib/hono'
import { convertAmountFromMiliunits, formatCurrency } from '@/lib/utils'

export const useGetAnalytics = () => {
  const query = useQuery({
    queryKey: ['foods-analytics'],
    queryFn: async () => {
      const response = await client.api['foods'].analytics.$get({})

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Falha para obter as análises')
      }

      const { data } = await response.json()
      return {
        ...data,
        totalRevenue: formatCurrency(
          convertAmountFromMiliunits(data.totalRevenue)
        ),
      }
    },
  })

  return query
}
