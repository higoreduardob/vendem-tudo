import { useQuery } from '@tanstack/react-query'

import { client } from '@/lib/hono'
import { convertAmountFromMiliunits } from '@/lib/utils'

import {
  useFilterFood,
  useSearchFood,
} from '@/features/foods/hooks/use-filter-food'

export const useGetFoods = () => {
  const { status } = useFilterFood()

  const query = useQuery({
    queryKey: ['foods', status],
    queryFn: async () => {
      const response = await client.api.foods.$get({
        query: { status },
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
      }))
    },
  })

  return query
}

export const useGetStoreFoods = (storeId?: string) => {
  const { categoryId, search } = useSearchFood()

  const query = useQuery({
    enabled: !!storeId,
    queryKey: ['store-foods', categoryId, search],
    queryFn: async () => {
      const response = await client.api.foods.stores[':storeId'].$get({
        param: { storeId },
        query: { categoryId, search },
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
