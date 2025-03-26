import { toast } from 'sonner'
import { useMutation } from '@tanstack/react-query'
import { InferResponseType, InferRequestType } from 'hono'

import { client } from '@/lib/hono'

type ResponseType = InferResponseType<
  (typeof client.api.uploads.image)['$post']
>

type RequestType = InferRequestType<
  (typeof client.api.uploads.image)['$post']
>['form']

export const useUploadImage = (folder?: string) => {
  const mutation = useMutation<
    ResponseType,
    { message: string; status: number },
    RequestType
  >({
    mutationFn: async (formData) => {
      const response = await client.api.uploads.image.$post({
        query: { folder },
        form: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw {
          message: data.error || 'Falha no upload da imagem',
          status: response.status,
        }
      }

      const data = await response.json()

      if (!('url' in data)) {
        throw {
          message: 'Resposta inválida do servidor',
          status: response.status,
        }
      }

      return data
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  return mutation
}
