'use client'

import { InsertStoreFormValues } from '@/features/stores/schema'

import { useGetStore } from '@/features/stores/api/use-get-store'
import { useEditStore } from '@/features/stores/api/use-edit-store'
import { useOpenStore } from '@/features/stores/hooks/use-open-store'

import { FormDialogStore } from '@/features/stores/components/form-dialog-store'

export const FormEditStore = () => {
  const { id, isOpen, onClose } = useOpenStore()

  const storeQuery = useGetStore(id)
  const editMutation = useEditStore(id)

  const isPending = editMutation.isPending

  const { data } = storeQuery

  if (!data) return null

  const defaultValues: InsertStoreFormValues = {
    name: data.name,
    slug: data.slug,
    email: data.email,
    cpfCnpj: data.cpfCnpj || '',
    whatsApp: data.whatsApp || '',
    role: data.role,
    address: data.address,
    payment: data.payment,
    schedules: data.schedules,
    shippingRole: data.shippingRole,
    shippings: data.shippings,
  }

  const onSubmit = (values: InsertStoreFormValues) => {
    editMutation.mutate(values, {
      onSuccess: () => {
        onClose()
      },
    })
  }

  return (
    <>
      <FormDialogStore
        isOpen={isOpen}
        isPending={isPending}
        defaultValues={defaultValues}
        handleClose={onClose}
        onSubmit={onSubmit}
      />
    </>
  )
}
