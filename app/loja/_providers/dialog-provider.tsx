'use client'

import { useMountedState } from 'react-use'

import { AboutStore } from '@/app/loja/_components/about-store'

import { FormCart } from '@/features/foods/orders/components/form-cart'
import { FormCheckout } from '@/features/foods/orders/components/form-checkout'
import { CheckoutDialog } from '@/features/foods/orders/components/checkout-dialog'

import { FormEditUpdate } from '@/features/auth/components/form-edit-update'

export const DialogProvider = () => {
  const isMounted = useMountedState()

  if (!isMounted) return null

  return (
    <>
      <AboutStore />

      <FormCart />
      <FormCheckout />
      <CheckoutDialog />

      <FormEditUpdate />
    </>
  )
}
