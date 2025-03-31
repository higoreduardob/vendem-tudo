import { useQuery } from '@tanstack/react-query'

import { client } from '@/lib/hono'

import { useFilterOption } from '@/features/foods/additionals/options/hooks/use-filter-option'

// TODO: Change fetch in list
export const useGetFoodOptions = () => {
  const { status } = useFilterOption()

  const query = useQuery({
    queryKey: ['food-options', status],
    queryFn: async () => {
      const response = await client.api['food-options'].$get({
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
