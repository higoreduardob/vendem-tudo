import { useQuery } from '@tanstack/react-query'

import { client } from '@/lib/hono'

import { useFilterAdditional } from '@/features/foods/additionals/hooks/use-filter-additional'

// TODO: Change fetch in list
export const useGetFoodAdditionals = () => {
  const { status } = useFilterAdditional()

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
