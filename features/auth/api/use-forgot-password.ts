import { toast } from 'sonner'
import { useMutation } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'

import { UserRole } from '@prisma/client'

import { client } from '@/lib/hono'

type ResponseType = InferResponseType<
  (typeof client.api.authenticate)['forgot-password']['$post']
>
type RequestType = InferRequestType<
  (typeof client.api.authenticate)['forgot-password']['$post']
>['json']

export const useForgotPassword = (role?: UserRole, storeId?: string) => {
  const mutation = useMutation<
    ResponseType,
    { message: string; status: number },
    RequestType
  >({
    mutationFn: async (json) => {
      const response = await client.api.authenticate['forgot-password'][
        '$post'
      ]({
        query: { role, storeId },
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
