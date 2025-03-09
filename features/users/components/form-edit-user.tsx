'use client'

import { UpdateFormValues } from '@/features/auth/schema'

import { useConfirm } from '@/hooks/use-confirm'
import { useGetUser } from '@/features/users/api/use-get-user'
import { useEditUser } from '@/features/users/api/use-edit-user'
import { useOpenUser } from '@/features/users/hooks/use-open-user'
import { useDeleteUser } from '@/features/users/api/use-delete-user'
import { useUndeleteUser } from '@/features/users/api/use-undelete-user'
import { FormDialogUser } from './form-dialog-user'

export const FormEditUser = () => {
  const { id, isOpen, onClose } = useOpenUser()

  const [ConfirmationDialog, confirm] = useConfirm(
    'Deseja realmente continuar?',
    'Após efetuar essa ação, você poderá reverter filtrando suas condições.'
  )

  const userQuery = useGetUser(id)
  const editMutation = useEditUser(id)
  const deleteMutation = useDeleteUser(id)
  const undeleteMutation = useUndeleteUser(id)

  const isPending = editMutation.isPending

  const { data } = userQuery

  if (!data) return null

  const defaultValues: UpdateFormValues = {
    name: data.name,
    cpfCnpj: data.cpfCnpj,
    whatsApp: data.whatsApp,
    address: data.address,
  }

  const onSubmit = (values: UpdateFormValues) => {
    editMutation.mutate(values, {
      onSuccess: () => {
        onClose()
      },
    })
  }

  const handleDelete = async () => {
    const ok = await confirm()

    if (ok) {
      if (data.status)
        deleteMutation.mutate(undefined, {
          onSuccess: () => {
            onClose()
          },
        })
      else
        undeleteMutation.mutate(undefined, {
          onSuccess: () => {
            onClose()
          },
        })
    }
  }

  return (
    <>
      <ConfirmationDialog />
      <FormDialogUser
        id={id}
        isOpen={isOpen}
        isPending={isPending}
        status={data.status}
        defaultValues={defaultValues}
        onDelete={handleDelete}
        handleClose={onClose}
        onSubmit={onSubmit}
      />
    </>
  )
}
