'use client'

import { useMountedState } from 'react-use'

import { AboutStore } from '../_components/about-store'
import { FormCheckout } from '@/features/foods/orders/components/form-checkout'

export const DialogProvider = () => {
  const isMounted = useMountedState()

  if (!isMounted) return null

  return (
    <>
      <AboutStore />

      <FormCheckout />
    </>
  )
}
