import { toast } from 'sonner'
import { InferResponseType } from 'hono'
import { useMutation } from '@tanstack/react-query'

import { client } from '@/lib/hono'

type ResponseType = InferResponseType<
  (typeof client.api)['stores'][':id']['enabled']['$patch']
>

export const useEnabledStore = (id?: string) => {
  const mutation = useMutation<
    ResponseType,
    { message: string; status: number }
  >({
    mutationFn: async () => {
      const response = await client.api['stores'][':id']['enabled']['$patch']({
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
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  return mutation
}
