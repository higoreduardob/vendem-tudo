import { useQuery } from '@tanstack/react-query'

import { client } from '@/lib/hono'
import { useFilterCategory } from '@/features/foods/categories/hooks/use-filter-category'

export const useGetCategories = () => {
  const { status } = useFilterCategory()

  const query = useQuery({
    queryKey: ['food-categories', status],
    queryFn: async () => {
      const response = await client.api['food-categories'].$get({
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

export const useGetStoreCategories = (storeId?: string) => {
  const query = useQuery({
    enabled: !!storeId,
    queryKey: ['store-food-categories'],
    queryFn: async () => {
      const response = await client.api['food-categories'].stores[
        ':storeId'
      ].$get({
        param: { storeId },
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
