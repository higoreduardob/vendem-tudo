import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useQuery } from '@tanstack/react-query'

import { client } from '@/lib/hono'
import { convertAmountFromMiliunits } from '@/lib/utils'
import { translateStorePayment } from '@/lib/i18n'
import { StorePayment } from '@prisma/client'

export const useGetOverview = () => {
  const query = useQuery({
    queryKey: ['orders-overview'],
    queryFn: async () => {
      const response = await client.api['food-orders'].overview.$get({})

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Falha para obter as análises')
      }

      const { data } = await response.json()
      return {
        ...data,
        dailyMetrics: data.dailyMetrics.map((metric) => ({
          ...metric,
          date: format(new Date(metric.date + 'T00:00:00'), 'dd MMM', {
            locale: ptBR,
          }),
          avgTicket: convertAmountFromMiliunits(metric.avgTicket),
          invoicing: convertAmountFromMiliunits(metric.invoicing),
        })),
        paymentMethods: data.paymentMethods.map((item) => ({
          ...item,
          payment: translateStorePayment(item.payment as StorePayment),
        })),
      }
    },
  })

  return query
}
