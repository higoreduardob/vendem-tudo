'use client'

import { useOpenStore } from '@/hooks/use-store'

import { FormSignUpVerified } from '@/features/auth/components/form-sign-up-verified'

export default function SignUpVerifiedPage() {
  const { store } = useOpenStore()

  return <FormSignUpVerified slug={store?.slug} isCustomer />
}
