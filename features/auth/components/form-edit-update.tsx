'use client'

import { mapSessionToUpdateData } from '@/lib/utils'

import { UpdateFormValues } from '@/features/auth/schema'

import { useUpdate } from '@/features/auth/api/use-update'
import { useOpenUpdate } from '@/features/auth/hooks/use-open-update'
import { useCurrentUser } from '@/features/auth/hooks/use-current-user'

import { FormDialogUpdate } from '@/features/auth/components/form-update'

export const FormEditUpdate = () => {
  const { user, update } = useCurrentUser()
  const { isOpen, onClose } = useOpenUpdate()

  if (!user) return null

  const { id } = user
  const mutation = useUpdate(id)
  const isPending = mutation.isPending

  const onSubmit = (values: UpdateFormValues) => {
    mutation.mutate(values, {
      onSuccess: async () => {
        await update()
        onClose()
      },
    })
  }

  return (
    <FormDialogUpdate
      isOpen={isOpen}
      isPending={isPending}
      defaultValues={mapSessionToUpdateData(user)}
      handleClose={onClose}
      onSubmit={onSubmit}
    />
  )
}
