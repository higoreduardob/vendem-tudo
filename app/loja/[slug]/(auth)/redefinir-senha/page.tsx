'use client'

import { useOpenStore } from '@/hooks/use-store'

import { FormResetPassword } from '@/features/auth/components/form-reset-password'

export default function ResetPasswordPage() {
  const { store } = useOpenStore()

  return <FormResetPassword role="CUSTOMER" slug={store?.slug} isCustomer />
}
