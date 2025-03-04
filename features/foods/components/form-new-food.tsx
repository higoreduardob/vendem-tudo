'use client'

import { convertAmountToMiliunits } from '@/lib/utils'

import {
  insertFoodDefaultValues,
  InsertFoodFormValues,
} from '@/features/foods/schema'

import { useNewFood } from '@/features/foods/hooks/use-new-food'
import { useCreateFood } from '@/features/foods/api/use-create-food'

import { FormFood } from '@/features/foods/components/form-food'

export const FormNewFood = () => {
  const { isOpen, onClose } = useNewFood()

  const mutation = useCreateFood()
  const isPending = mutation.isPending

  const onSubmit = (values: InsertFoodFormValues) => {
    mutation.mutate(
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

  return (
    <FormFood
      isOpen={isOpen}
      isPending={isPending}
      defaultValues={insertFoodDefaultValues}
      handleClose={onClose}
      onSubmit={onSubmit}
    />
  )
}
