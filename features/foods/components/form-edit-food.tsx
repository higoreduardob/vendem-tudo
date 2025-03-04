'use client'

import { convertAmountToMiliunits } from '@/lib/utils'

import { InsertFoodFormValues } from '@/features/foods/schema'

import { useConfirm } from '@/hooks/use-confirm'
import { useGetFood } from '@/features/foods/api/use-get-food'
import { useEditFood } from '@/features/foods/api/use-edit-food'
import { useOpenFood } from '@/features/foods/hooks/use-open-food'
import { useDeleteFood } from '@/features/foods/api/use-delete-food'
import { useUndeleteFood } from '@/features/foods/api/use-undelete-food'

import { FormFood } from '@/features/foods/components/form-food'

export const FormEditFood = () => {
  const { id, isOpen, onClose } = useOpenFood()

  const [ConfirmationDialog, confirm] = useConfirm(
    'Deseja realmente continuar?',
    'Após efetuar essa ação, você poderá reverter filtrando suas condições.'
  )

  const foodQuery = useGetFood(id)
  const editMutation = useEditFood(id)
  const deleteMutation = useDeleteFood(id)
  const undeleteMutation = useUndeleteFood(id)

  const isPending = editMutation.isPending

  const { data } = foodQuery

  if (!data) return null

  const defaultValues: InsertFoodFormValues = {
    name: data.name,
    description: data.description,
    price: data.price.toString(),
    promotion: data.promotion.toString(),
    categoryId: data.categoryId,
    additionals: data.additionals.map(
      (additional) => additional.foodAdditionalId
    ),
  }

  const onSubmit = (values: InsertFoodFormValues) => {
    editMutation.mutate(
      {
        ...values,
        price: convertAmountToMiliunits(values.price),
        promotion: convertAmountToMiliunits(values.promotion),
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
      <FormFood
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
