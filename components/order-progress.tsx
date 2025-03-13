import { OrderHistoryProgress } from '@prisma/client'

import { translateOrderHistoryProgress } from '@/lib/i18n'

import { Badge } from '@/components/ui/badge'

export const OrderProgress = ({
  progress,
}: {
  progress: OrderHistoryProgress
}) => {
  const getStatusConfig = (progress: OrderHistoryProgress) => {
    switch (progress) {
      case 'PENDING':
        return {
          label: translateOrderHistoryProgress(progress),
          variant: 'outline' as const,
          className:
            'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100',
        }
      case 'ACCEPT':
        return {
          label: translateOrderHistoryProgress(progress),
          variant: 'outline' as const,
          className:
            'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
        }
      case 'DELIVERY':
        return {
          label: translateOrderHistoryProgress(progress),

          variant: 'outline' as const,
          className:
            'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
        }
      case 'DELIVERED':
        return {
          label: translateOrderHistoryProgress(progress),

          variant: 'outline' as const,
          className:
            'bg-green-50 text-green-700 border-green-200 hover:bg-green-100',
        }
      case 'CANCELLED':
        return {
          label: translateOrderHistoryProgress(progress),

          variant: 'outline' as const,
          className: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100',
        }
      default:
        return {
          label: translateOrderHistoryProgress(progress),
          variant: 'outline' as const,
          className:
            'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100',
        }
    }
  }

  const config = getStatusConfig(progress)

  return (
    <Badge variant={config.variant} className={`${config.className} w-fit`}>
      {config.label}
    </Badge>
  )
}
