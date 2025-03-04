'use client'

import { convertAmountToMiliunits } from '@/lib/utils'

import { InsertFoodOptionFormValues } from '@/features/foods/additionals/options/schema'

import { useConfirm } from '@/hooks/use-confirm'
import { useEditFoodOption } from '@/features/foods/additionals/options/api/use-edit-food-option'
import { useGetFoodOption } from '@/features/foods/additionals/options/api/use-get-food-option'
import { useOpenFoodOption } from '@/features/foods/additionals/options/hooks/use-open-food-option'
import { useDeleteFoodOption } from '@/features/foods/additionals/options/api/use-delete-food-option'
import { useUndeleteFoodOption } from '@/features/foods/additionals/options/api/use-undelete-food-option'

import { FormFoodOption } from './form-food-option'

export const FormEditFoodOption = () => {
  const { id, isOpen, onClose } = useOpenFoodOption()

  const [ConfirmationDialog, confirm] = useConfirm(
    'Deseja realmente continuar?',
    'Após efetuar essa ação, você poderá reverter filtrando suas condições.'
  )

  const optionQuery = useGetFoodOption(id)
  const editMutation = useEditFoodOption(id)
  const deleteMutation = useDeleteFoodOption(id)
  const undeleteMutation = useUndeleteFoodOption(id)

  const isPending = editMutation.isPending

  const { data } = optionQuery

  if (!data) return null

  const defaultValues: InsertFoodOptionFormValues = {
    name: data.name,
    description: data.description,
    price: data.price.toString(),
  }

  const onSubmit = (values: InsertFoodOptionFormValues) => {
    editMutation.mutate(
      {
        ...values,
        price: convertAmountToMiliunits(values.price),
      },
      {
        onSuccess: () => {
          onClose()
        },
      }
    )
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
      <FormFoodOption
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
