'use client'

import { useOpenStore } from '@/hooks/use-store'

import { FormSignUp } from '@/features/auth/components/form-sign-up'

export default function SignUpPage() {
  const { store } = useOpenStore()

  return (
    <FormSignUp
      role="CUSTOMER"
      storeId={store?.id}
      slug={store?.slug}
      isCustomer
    />
  )
}
