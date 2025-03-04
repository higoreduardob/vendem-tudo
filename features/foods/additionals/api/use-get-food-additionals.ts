import { useQuery } from '@tanstack/react-query'

import { client } from '@/lib/hono'

export const useGetFoodAdditionals = () => {
  const query = useQuery({
    queryKey: ['food-additionals'],
    queryFn: async () => {
      const response = await client.api['food-additionals'].$get()

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
