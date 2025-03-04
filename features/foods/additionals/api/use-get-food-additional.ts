import { useQuery } from '@tanstack/react-query'

import { client } from '@/lib/hono'

export const useGetFoodAdditional = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ['food-additionals', id],
    queryFn: async () => {
      const response = await client.api['food-additionals'][':id'].$get({
        param: { id },
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
