'use client'

import { useMountedState } from 'react-use'

import { FormEditStore } from '@/features/stores/components/form-edit-store'
import { FormOwnerNewStore as FormNewStore } from '@/features/stores/components/form-new-store'

import { FormNewFood } from '@/features/foods/components/form-new-food'
import { FormEditFood } from '@/features/foods/components/form-edit-food'

import { FormEditUser } from '@/features/users/components/form-edit-user'

import { FormNewCategory as FormNewFoodCategory } from '@/features/foods/categories/components/form-new-category'
import { FormEditCategory as FormEditFoodCategory } from '@/features/foods/categories/components/form-edit-category'

import { FormNewFoodAdditional } from '@/features/foods/additionals/components/form-new-food-additional'
import { FormEditFoodAdditional } from '@/features/foods/additionals/components/form-edit-food-additional'
import { TableAdditional as TableFoodAdditional } from '@/features/foods/additionals/components/table-additional'

import { FormNewFoodOption } from '@/features/foods/additionals/options/components/form-new-food-option'
import { FormEditFoodOption } from '@/features/foods/additionals/options/components/form-edit-food-option'
import { TableOption as TableFoodOption } from '@/features/foods/additionals/options/components/table-option'

export const DialogProvider = () => {
  const isMounted = useMountedState()

  if (!isMounted) return null

  return (
    <>
      <FormNewStore />
      <FormEditStore />

      <FormNewFood />
      <FormEditFood />

      <FormEditUser />

      <FormNewFoodCategory />
      <FormEditFoodCategory />

      <FormNewFoodAdditional />
      <FormEditFoodAdditional />
      <TableFoodAdditional />

      <FormNewFoodOption />
      <FormEditFoodOption />
      <TableFoodOption />
    </>
  )
}
