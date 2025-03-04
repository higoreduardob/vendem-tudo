'use client'

import {
  insertCategoryDefaultValues,
  InsertCategoryFormValues,
} from '@/features/foods/categories/schema'

import { useNewCategory } from '@/features/foods/categories/hooks/use-new-category'
import { useCreateCategory } from '@/features/foods/categories/api/use-create-category'

import { FormCategory } from '@/features/foods/categories/components/form-category'

export const FormNewCategory = () => {
  const { isOpen, onClose } = useNewCategory()

  const mutation = useCreateCategory()
  const isPending = mutation.isPending

  const onSubmit = (values: InsertCategoryFormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        onClose()
      },
    })
  }

  return (
    <FormCategory
      isOpen={isOpen}
      isPending={isPending}
      defaultValues={insertCategoryDefaultValues}
      handleClose={onClose}
      onSubmit={onSubmit}
    />
  )
}
