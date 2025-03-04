import { toast } from 'sonner'
import { useMutation } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'

import { client } from '@/lib/hono'

type ResponseType = InferResponseType<
  (typeof client.api.authenticate)['verify-recaptcha']['$post']
>
type RequestType = InferRequestType<
  (typeof client.api.authenticate)['verify-recaptcha']['$post']
>['json']

export const useVerifyCaptcha = () => {
  const mutation = useMutation<
    ResponseType,
    { message: string; status: number },
    RequestType
  >({
    mutationFn: async (json) => {
      const response = await client.api.authenticate['verify-recaptcha'][
        '$post'
      ]({
        json,
      })

      if (!response.ok) {
        const data = await response.json()

        throw {
          message: data.error || 'Erro desconhecido contate o administrador',
          status: response.status,
        }
      }

      return await response.json()
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  return mutation
}
