import { useQuery } from '@tanstack/react-query'

import { client } from '@/lib/hono'
import { cpfCnpjMask, phoneMask, zipCodeMask } from '@/lib/format'

export const useGetUser = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ['users', id],
    queryFn: async () => {
      const response = await client.api['management'][':id'].$get({
        param: { id },
      })

      if (!response.ok) {
        const data = await response.json()

        throw new Error(data.error)
      }

      const { data } = await response.json()
      const { address } = data
      return {
        ...data,
        whatsApp: phoneMask(data.whatsApp),
        cpfCnpj: cpfCnpjMask(data.cpfCnpj),
        address: {
          street: address?.street || '',
          neighborhood: address?.neighborhood || '',
          city: address?.city || '',
          state: address?.state || '',
          number: address?.number || '',
          zipCode: address?.zipCode ? zipCodeMask(address.zipCode) : '',
          complement: address?.complement || '',
        },
      }
    },
  })

  return query
}
