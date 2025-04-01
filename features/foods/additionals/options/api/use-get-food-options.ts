import { useQuery } from '@tanstack/react-query'

import { client } from '@/lib/hono'
import { convertAmountFromMiliunits } from '@/lib/utils'

export const useGetFoodOptions = (status?: string) => {
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
      return data.map((option) => ({
        ...option,
        price: convertAmountFromMiliunits(option.price),
      }))
    },
  })

  return query
}
