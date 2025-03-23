'use client'

import {
  useNewOwnerStore,
  useNewAdministratorStore,
} from '@/features/stores/hooks/use-new-store'
import { useCreateStore as useOwnerCreateStore } from '@/features/stores/api/use-create-store'
import { useCreateStore as useAdministratorCreateStore } from '@/features/management/api/use-create-store'

import {
  insertStoreDefaultValues,
  InsertStoreFormValues,
} from '@/features/stores/schema'

import { FormDialogStore } from '@/features/stores/components/form-dialog-store'

export const FormOwnerNewStore = () => {
  const { isOpen, onClose } = useNewOwnerStore()

  const mutation = useOwnerCreateStore()
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

export const FormAdministratorNewStore = () => {
  const { isOpen, onClose, token, password } = useNewAdministratorStore()

  const mutation = useAdministratorCreateStore(token, password)
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
