'use client'

import { convertAmountToMiliunits } from '@/lib/utils'

import {
  InsertFoodOptionFormValues,
  insertFoodOptionDefaultValues,
} from '@/features/foods/additionals/options/schema'

import { useNewFoodOption } from '@/features/foods/additionals/options/hooks/use-new-food-option'
import { useCreateFoodOption } from '@/features/foods/additionals/options/api/use-create-food-option'

import { FormFoodOption } from '@/features/foods/additionals/options/components/form-food-option'

export const FormNewFoodOption = () => {
  const { isOpen, onClose } = useNewFoodOption()

  const mutation = useCreateFoodOption()
  const isPending = mutation.isPending

  const onSubmit = (values: InsertFoodOptionFormValues) => {
    mutation.mutate(
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

  return (
    <FormFoodOption
      isOpen={isOpen}
      isPending={isPending}
      defaultValues={insertFoodOptionDefaultValues}
      handleClose={onClose}
      onSubmit={onSubmit}
    />
  )
}
