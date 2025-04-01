import { useQuery } from '@tanstack/react-query'

import { client } from '@/lib/hono'

export const useGetFoodAdditionals = (status?: string) => {
  const query = useQuery({
    queryKey: ['food-additionals', status],
    queryFn: async () => {
      const response = await client.api['food-additionals'].$get({
        query: { status },
      })

      if (!response.ok) {
        const data = await response.json()

        throw new Error(data.error)
      }

      const { data } = await response.json()
      return data
    },
  })

  return query
}
