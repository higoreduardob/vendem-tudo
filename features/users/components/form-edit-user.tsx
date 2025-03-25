'use client'

import { UpdateFormValues } from '@/features/auth/schema'

import { useConfirm } from '@/hooks/use-confirm'
import { useGetUser as useOwnerGetUser } from '@/features/users/api/use-get-user'
import { useEditUser as useOwnerEditUser } from '@/features/users/api/use-edit-user'
import { useOpenUser as useOwnerOpenUser } from '@/features/users/hooks/use-open-user'
import { useDeleteUser as useOwnerDeleteUser } from '@/features/users/api/use-delete-user'
import { useUndeleteUser as useOwnerUndeleteUser } from '@/features/users/api/use-undelete-user'

import { useGetUser as useAdministratorGetUser } from '@/features/management/api/use-get-user'
import { useEditUser as useAdministratorEditUser } from '@/features/management/api/use-edit-user'
import { useOpenUser as useAdministratorOpenUser } from '@/features/management/hooks/use-open-user'
import { useDeleteUser as useAdministratorDeleteUser } from '@/features/management/api/use-delete-user'
import { useUndeleteUser as useAdministratorUndeleteUser } from '@/features/management/api/use-undelete-user'

import { FormDialogUser } from '@/features/users/components/form-dialog-user'

export const FormOwnerEditUser = () => {
  const { id, isOpen, onClose } = useOwnerOpenUser()

  const [ConfirmationDialog, confirm] = useConfirm(
    'Deseja realmente continuar?',
    'Após efetuar essa ação, você poderá reverter filtrando suas condições.'
  )

  const userQuery = useOwnerGetUser(id)
  const editMutation = useOwnerEditUser(id)
  const deleteMutation = useOwnerDeleteUser(id)
  const undeleteMutation = useOwnerUndeleteUser(id)

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

export const FormAdministratorEditUser = () => {
  const { id, isOpen, onClose } = useAdministratorOpenUser()

  const userQuery = useAdministratorGetUser(id)
  const editMutation = useAdministratorEditUser(id)
  const deleteMutation = useAdministratorDeleteUser(id)
  const undeleteMutation = useAdministratorUndeleteUser(id)

  const [ConfirmationDialog, confirm] = useConfirm(
    'Deseja realmente continuar?',
    'Após efetuar essa ação, você poderá reverter filtrando suas condições.'
  )

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
