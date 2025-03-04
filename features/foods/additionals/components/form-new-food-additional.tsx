'use client'

import {
  InsertAdditionalFormValues,
  insertAdditionalDefaultValues,
} from '@/features/foods/additionals/schema'

import { useNewFoodAdditional } from '@/features/foods/additionals/hooks/use-new-food-additional'
import { useCreateFoodAdditional } from '@/features/foods/additionals/api/use-create-food-additional'

import { FormFoodAdditional } from '@/features/foods/additionals/components/form-food-additional'

export const FormNewFoodAdditional = () => {
  const { isOpen, onClose } = useNewFoodAdditional()

  const mutation = useCreateFoodAdditional()
  const isPending = mutation.isPending

  const onSubmit = (values: InsertAdditionalFormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        onClose()
      },
    })
  }

  return (
    <FormFoodAdditional
      isOpen={isOpen}
      isPending={isPending}
      defaultValues={insertAdditionalDefaultValues}
      handleClose={onClose}
      onSubmit={onSubmit}
    />
  )
}
