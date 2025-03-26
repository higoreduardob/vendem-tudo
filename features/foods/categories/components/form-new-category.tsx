'use client'

import { toast } from 'sonner'
import { useState } from 'react'

import {
  insertCategoryDefaultValues,
  InsertCategoryFormValues,
} from '@/features/foods/categories/schema'

import { useUploadImage } from '@/features/uploads/image/api/use-upload-image'
import { useNewCategory } from '@/features/foods/categories/hooks/use-new-category'
import { useCreateCategory } from '@/features/foods/categories/api/use-create-category'

import { FormCategory } from '@/features/foods/categories/components/form-category'

export const FormNewCategory = () => {
  const [isSubmitImage, setIsSubmitImage] = useState(false)
  const { isOpen, onClose } = useNewCategory()

  const mutation = useCreateCategory()
  const { mutateAsync: uploadImage } = useUploadImage('food-categories')
  const isPending = mutation.isPending || isSubmitImage

  const onSubmit = async (values: InsertCategoryFormValues) => {
    let imageUrl: string
    const { image } = values

    try {
      if (image instanceof File) {
        setIsSubmitImage(true)
        const uploadResult = await uploadImage({
          image: image,
        })
        setIsSubmitImage(false)

        if (!('url' in uploadResult)) {
          throw new Error('Resposta de upload inválida')
        }

        imageUrl = uploadResult.url
      } else if (typeof image === 'string') {
        imageUrl = image
      } else {
        throw new Error('Tipo de imagem inválido')
      }

      mutation.mutate(
        { ...values, image: imageUrl },
        {
          onSuccess: () => {
            onClose()
          },
        }
      )
    } catch (error) {
      toast.error('Falha ao fazer upload da imagem')
    }
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
