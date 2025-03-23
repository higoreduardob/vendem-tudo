'use client'

import { useOpenStore } from '@/hooks/use-store'

import { FormWrapperSignUp } from '@/features/auth/components/form-wrapper-sign-up'

export default function SignUpPage() {
  const { store } = useOpenStore()

  return (
    <FormWrapperSignUp role="CUSTOMER" storeId={store?.id} slug={store?.slug} />
  )
}
