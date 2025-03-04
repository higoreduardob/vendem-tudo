'use client'

import { useNewStore } from '@/features/stores/hooks/use-new-store'
import { useCreateStore } from '@/features/stores/api/use-create-store'

import {
  insertStoreDefaultValues,
  InsertStoreFormValues,
} from '@/features/stores/schema'

import { FormDialogStore } from '@/features/stores/components/form-dialog-store'

export const FormNewStore = () => {
  const { isOpen, onClose } = useNewStore()

  const mutation = useCreateStore()
  const isPending = mutation.isPending

  const onSubmit = (values: InsertStoreFormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        onClose()
      },
    })
  }

  return (
    <FormDialogStore
      isOpen={isOpen}
      isPending={isPending}
      defaultValues={insertStoreDefaultValues}
      handleClose={onClose}
      onSubmit={onSubmit}
    />
  )
}
