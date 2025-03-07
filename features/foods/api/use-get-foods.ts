import { useQuery } from '@tanstack/react-query'

import { client } from '@/lib/hono'

import { convertAmountFromMiliunits } from '@/lib/utils'

export const useGetFoods = () => {
  const query = useQuery({
    queryKey: ['foods'],
    queryFn: async () => {
      const response = await client.api.foods.$get()

      if (!response.ok) {
        const data = await response.json()

        throw new Error(data.error)
      }

      const { data } = await response.json()
      return data.map((food) => ({
        ...food,
        price: convertAmountFromMiliunits(food.price),
        promotion: convertAmountFromMiliunits(food.promotion),
      }))
    },
  })

  return query
}

export const useGetStoreFoods = (storeId?: string) => {
  const query = useQuery({
    enabled: !!storeId,
    queryKey: ['store-foods'],
    queryFn: async () => {
      const response = await client.api.foods.stores[':storeId'].$get({
        param: { storeId },
      })

      if (!response.ok) {
        const data = await response.json()

        throw new Error(data.error)
      }

      const { data } = await response.json()
      return data.map((food) => ({
        ...food,
        price: convertAmountFromMiliunits(food.price),
        promotion: convertAmountFromMiliunits(food.promotion),
        additionals: food.additionals.map((additional) => ({
          ...additional,
          foodAdditional: {
            ...additional.foodAdditional,
            options: additional.foodAdditional.options.map((option) => ({
              ...option,
              foodOption: {
                ...option.foodOption,
                price: convertAmountFromMiliunits(option.foodOption.price),
              },
            })),
          },
        })),
      }))
    },
  })

  return query
}
