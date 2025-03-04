import { toast } from 'sonner'
import { useMutation } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'

import { client } from '@/lib/hono'

type ResponseType = InferResponseType<
  (typeof client.api.authenticate)['sign-in']['validate']['$post']
>
type RequestType = InferRequestType<
  (typeof client.api.authenticate)['sign-in']['validate']['$post']
>

export const useSignInValidate = () => {
  const mutation = useMutation<
    ResponseType,
    { message: string; status: number },
    RequestType
  >({
    mutationFn: async () => {
      const response = await client.api.authenticate['sign-in']['validate'][
        '$post'
      ]()

      if (!response.ok) {
        throw {
          message: 'Sessão inválida faça login novamente',
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

// export const useSignInValidate = () => {
//   return useQuery<ResponseType>({
//     queryKey: ['validateUser'],
//     queryFn: async () => {
//       const response = await client.api.authenticate['sign-in']['validate']['$post']()

//       if (!response.ok) {
//         throw new Error('Erro ao validar usuário, contate o administrador')
//       }

//       return await response.json()
//     },
//     staleTime: 1000 * 60 * 5, // 5 minutos de cache (evita chamadas constantes)
//     refetchInterval: 1000 * 60 * 5, // Atualiza automaticamente a cada 5 minutos
//     refetchOnWindowFocus: false, // Evita chamadas desnecessárias ao focar a aba
//     onError: () => {
//       toast.error('Sessão inválida. Faça login novamente.')
//     },
//   })
// }
