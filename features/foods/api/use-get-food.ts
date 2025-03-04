import { useQuery } from '@tanstack/react-query'

import { client } from '@/lib/hono'

import { convertAmountFromMiliunits } from '@/lib/utils'

export const useGetFood = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ['foods', id],
    queryFn: async () => {
      const response = await client.api.foods[':id'].$get({
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
        promotion: convertAmountFromMiliunits(data.promotion),
      }
    },
  })

  return query
}
