import { useQuery } from '@tanstack/react-query'

import { convertAmountFromMiliunits } from '@/lib/utils'

import { client } from '@/lib/hono'

export const useGetFoodOption = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ['food-options', id],
    queryFn: async () => {
      const response = await client.api['food-options'][':id'].$get({
        param: { id },
      })

      if (!response.ok) {
        const data = await response.json()

        throw new Error(data.error)
      }

      const { data } = await response.json()
      return {
        ...data,
        price: convertAmountFromMiliunits(data.price),
      }
    },
  })

  return query
}
