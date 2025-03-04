'use client'

import { InsertAdditionalFormValues } from '@/features/foods/additionals/schema'

import { useConfirm } from '@/hooks/use-confirm'
import { useGetFoodAdditional } from '@/features/foods/additionals/api/use-get-food-additional'
import { useEditFoodAdditional } from '@/features/foods/additionals/api/use-edit-food-additional'
import { useOpenFoodAdditional } from '@/features/foods/additionals/hooks/use-open-food-additional'
import { useDeleteFoodAdditional } from '@/features/foods/additionals/api/use-delete-food-additional'
import { useUndeleteFoodAdditional } from '@/features/foods/additionals/api/use-undelete-food-additional'

import { FormFoodAdditional } from '@/features/foods/additionals/components/form-food-additional'

export const FormEditFoodAdditional = () => {
  const { id, isOpen, onClose } = useOpenFoodAdditional()

  const [ConfirmationDialog, confirm] = useConfirm(
    'Deseja realmente continuar?',
    'Após efetuar essa ação, você poderá reverter filtrando suas condições.'
  )

  const additionalQuery = useGetFoodAdditional(id)
  const editMutation = useEditFoodAdditional(id)
  const deleteMutation = useDeleteFoodAdditional(id)
  const undeleteMutation = useUndeleteFoodAdditional(id)

  const isPending = editMutation.isPending

  const { data } = additionalQuery

  if (!data) return null

  const defaultValues: InsertAdditionalFormValues = {
    name: data.name,
    description: data.description,
    required: data.required,
    limit: data.limit,
    role: data.role,
    minRequired: data.minRequired,
    options: data.options.map((option) => option.foodOptionId),
  }

  const onSubmit = (values: InsertAdditionalFormValues) => {
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
      <FormFoodAdditional
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
