import { toast } from 'sonner'
import { InferRequestType, InferResponseType } from 'hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { client } from '@/lib/hono'

type ResponseType = InferResponseType<
  (typeof client.api)['food-orders'][':id']['history']['$patch']
>
type RequestType = InferRequestType<
  (typeof client.api)['food-orders'][':id']['history']['$patch']
>['json']

export const useUpdateHistory = (id?: string) => {
  const queryClient = useQueryClient()

  const mutation = useMutation<
    ResponseType,
    { message: string; status: number },
    RequestType
  >({
    mutationFn: async (json) => {
      const response = await client.api['food-orders'][':id']['history'][
        '$patch'
      ]({
        param: { id },
        json,
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
      queryClient.invalidateQueries({ queryKey: ['food-orders', id] })
      queryClient.invalidateQueries({ queryKey: ['food-orders'] })
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  return mutation
}
