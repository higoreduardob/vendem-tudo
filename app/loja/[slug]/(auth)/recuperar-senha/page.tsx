'use client'

import { useOpenStore } from '@/hooks/use-store'

import { FormForgotPassword } from '@/features/auth/components/form-forgot-password'

export default function RecoveryPasswordPage() {
  const { store } = useOpenStore()

  return (
    <FormForgotPassword
      role="CUSTOMER"
      slug={store?.slug}
      storeId={store?.id}
      isCustomer
    />
  )
}
