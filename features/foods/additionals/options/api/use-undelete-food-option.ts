import { toast } from 'sonner'
import { InferResponseType } from 'hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { client } from '@/lib/hono'

type ResponseType = InferResponseType<
  (typeof client.api)['food-options'][':id']['undelete']['$patch']
>

export const useUndeleteFoodOption = (id?: string) => {
  const queryClient = useQueryClient()

  const mutation = useMutation<
    ResponseType,
    { message: string; status: number }
  >({
    mutationFn: async () => {
      const response = await client.api['food-options'][':id']['undelete'][
        '$patch'
      ]({
        param: { id },
      })

      if (!response.ok) {
        const data = await response.json()

        throw {
          message: data.error,
          status: response.status,
        }
      }

      return await response.json()
    },
    onSuccess: (res) => {
      if ('success' in res) {
        toast.success(res.success)
      }
      queryClient.invalidateQueries({ queryKey: ['food-options'] })
      queryClient.invalidateQueries({ queryKey: ['food-options', id] })
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  return mutation
}
