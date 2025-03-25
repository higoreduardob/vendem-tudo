'use client'

import { useMountedState } from 'react-use'

import { FormDialogSingUp } from '@/features/auth/components/form-dialog-sign-up'

import { FormAdministratorNewStore } from '@/features/stores/components/form-new-store'

import { FormAdministratorEditUser } from '@/features/users/components/form-edit-user'

export const DialogProvider = () => {
  const isMounted = useMountedState()

  if (!isMounted) return null

  return (
    <>
      <FormDialogSingUp />

      <FormAdministratorNewStore />

      <FormAdministratorEditUser />
    </>
  )
}
