'use client'

import { useMountedState } from 'react-use'

import { FormOrder } from '@/features/foods/orders/components/form-order'

export const SheetProvider = () => {
  const isMounted = useMountedState()

  if (!isMounted) return null

  return (
    <>
      <FormOrder />
    </>
  )
}
