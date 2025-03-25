import { useQuery } from '@tanstack/react-query'

import { client } from '@/lib/hono'

export const useGetAnalytics = () => {
  const query = useQuery({
    queryKey: ['food-categories-analytics'],
    queryFn: async () => {
      const response = await client.api['food-categories'].analytics.$get({})

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Falha para obter as análises')
      }

      const { data } = await response.json()
      return data
    },
  })

  return query
}
