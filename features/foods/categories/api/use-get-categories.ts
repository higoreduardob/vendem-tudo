import { useQuery } from '@tanstack/react-query'

import { client } from '@/lib/hono'

export const useGetCategories = () => {
  const query = useQuery({
    queryKey: ['food-categories'],
    queryFn: async () => {
      const response = await client.api['food-categories'].$get()

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
