import { useQuery } from '@tanstack/react-query'

import { useFilterOrder } from '@/features/foods/orders/hooks/use-filter-order'

import { AddressFormValues } from '@/features/common/schema'

import { client } from '@/lib/hono'
import { phoneMask, zipCodeMask } from '@/lib/format'
import { convertAmountFromMiliunits } from '@/lib/utils'

export const useGetOrders = (today?: boolean) => {
  const { status, from, to } = useFilterOrder()

  const query = useQuery({
    queryKey: ['food-orders', status, from, to],
    queryFn: async () => {
      const response = await client.api['food-orders'].$get({
        query: { today: String(today), status, from, to },
      })

      if (!response.ok) {
        const data = await response.json()

        throw new Error(data.error)
      }

      const { data } = await response.json()

      const formattedAddress = (address: AddressFormValues | null) =>
        address
          ? {
              street: address.street || '',
              neighborhood: address.neighborhood || '',
              city: address.city || '',
              state: address.state || '',
              number: address.number || '',
              zipCode: address.zipCode ? zipCodeMask(address.zipCode) : '',
              complement: address.complement || '',
            }
          : null

      return data.map((item) => ({
        ...item,
        customer: {
          ...item.customer,
          whatsApp: phoneMask(item.customer.whatsApp),
        },
        address: formattedAddress(item.address),
        amount: convertAmountFromMiliunits(item.amount),
        moneyChange: convertAmountFromMiliunits(item.moneyChange),
        shipping: item.shipping
          ? {
              ...item.shipping,
              fee: convertAmountFromMiliunits(item.shipping?.fee || 0),
            }
          : null,
      }))
    },
    refetchInterval: 5 * 1000, // TODO: Create webhook
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
  })

  return query
}

export const useGetStoreOrders = (storeId?: string) => {
  const query = useQuery({
    enabled: !!storeId,
    queryKey: ['store-food-orders'],
    queryFn: async () => {
      const response = await client.api['food-orders'].stores[':storeId'].$get({
        param: { storeId },
      })

      if (!response.ok) {
        const data = await response.json()

        throw new Error(data.error)
      }

      const { data } = await response.json()

      const formattedAddress = (address: AddressFormValues | null) =>
        address
          ? {
              street: address.street || '',
              neighborhood: address.neighborhood || '',
              city: address.city || '',
              state: address.state || '',
              number: address.number || '',
              zipCode: address.zipCode ? zipCodeMask(address.zipCode) : '',
              complement: address.complement || '',
            }
          : null

      return data.map((item) => ({
        ...item,
        address: formattedAddress(item.address),
        amount: convertAmountFromMiliunits(item.amount),
        moneyChange: convertAmountFromMiliunits(item.moneyChange),
        shipping: item.shipping
          ? {
              ...item.shipping,
              fee: convertAmountFromMiliunits(item.shipping?.fee || 0),
            }
          : null,
      }))
    },
    refetchInterval: 5 * 1000, // TODO: Create webhook
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
  })

  return query
}
