'use client'

import { toast } from 'sonner'
import { useState } from 'react'

import { convertAmountToMiliunits } from '@/lib/utils'

import {
  insertFoodDefaultValues,
  InsertFoodFormValues,
} from '@/features/foods/schema'

import { useNewFood } from '@/features/foods/hooks/use-new-food'
import { useCreateFood } from '@/features/foods/api/use-create-food'
import { useUploadImage } from '@/features/uploads/image/api/use-upload-image'

import { FormFood } from '@/features/foods/components/form-food'

export const FormNewFood = () => {
  const [isSubmitImage, setIsSubmitImage] = useState(false)

  const { isOpen, onClose } = useNewFood()

  const mutation = useCreateFood()
  const { mutateAsync: uploadImage } = useUploadImage('foods')
  const isPending = mutation.isPending || isSubmitImage

  const onSubmit = async (values: InsertFoodFormValues) => {
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
        {
          ...values,
          image: imageUrl,
          price: convertAmountToMiliunits(values.price),
          promotion: convertAmountToMiliunits(values.promotion),
        },
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
    <FormFood
      isOpen={isOpen}
      isPending={isPending}
      defaultValues={insertFoodDefaultValues}
      handleClose={onClose}
      onSubmit={onSubmit}
    />
  )
}
