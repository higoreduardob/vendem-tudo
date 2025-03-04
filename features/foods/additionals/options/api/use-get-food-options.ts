import { useQuery } from '@tanstack/react-query'

import { client } from '@/lib/hono'

export const useGetFoodOptions = () => {
  const query = useQuery({
    queryKey: ['food-options'],
    queryFn: async () => {
      const response = await client.api['food-options'].$get()

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
