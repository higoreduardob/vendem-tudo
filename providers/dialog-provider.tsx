'use client'

import { useMountedState } from 'react-use'

import { FormNewStore } from '@/features/stores/components/form-new-store'
import { FormEditStore } from '@/features/stores/components/form-edit-store'

export const DialogProvider = () => {
  const isMounted = useMountedState()

  if (!isMounted) return null

  return (
    <>
      <FormNewStore />
      <FormEditStore />
    </>
  )
}
