import { useQuery } from '@tanstack/react-query'

import { client } from '@/lib/hono'
import { cpfCnpjMask, phoneMask, zipCodeMask } from '@/lib/format'
import { addressDefaultValues } from '@/features/common/schema'

export const useGetStore = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ['stores', id],
    queryFn: async () => {
      const response = await client.api.stores[':id'].$get({
        param: { id },
      })

      if (!response.ok) {
        const data = await response.json()

        throw new Error(data.error)
      }

      const { data } = await response.json()
      const formattedAddress = data.address
        ? {
            street: data.address.street || '',
            neighborhood: data.address.neighborhood || '',
            city: data.address.city || '',
            state: data.address.state || '',
            number: data.address.number || '',
            zipCode: data.address.zipCode
              ? zipCodeMask(data.address.zipCode)
              : '',
            complement: data.address.complement || '',
          }
        : addressDefaultValues

      return {
        ...data,
        whatsApp: phoneMask(data.whatsApp),
        cpfCnpj: cpfCnpjMask(data.cpfCnpj),
        address: formattedAddress,
      }
    },
  })

  return query
}
