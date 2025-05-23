'use client'

import { useOpenStore } from '@/hooks/use-store'

import { FormSignIn } from '@/features/auth/components/form-sign-in'

export default function SignInPage() {
  const { store } = useOpenStore()

  if (!store) return null

  return (
    <FormSignIn
      role="CUSTOMER"
      storeId={store?.id}
      slug={store?.slug}
      isCustomer
    />
  )
}
