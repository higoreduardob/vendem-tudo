import { useQuery } from '@tanstack/react-query'

import { client } from '@/lib/hono'

export const useGetStores = () => {
  const query = useQuery({
    queryKey: ['stores'],
    queryFn: async () => {
      const response = await client.api.stores.$get()

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
