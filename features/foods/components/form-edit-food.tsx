'use client'

import { toast } from 'sonner'
import { useState } from 'react'

import { convertAmountToMiliunits } from '@/lib/utils'

import { InsertFoodFormValues } from '@/features/foods/schema'

import { useConfirm } from '@/hooks/use-confirm'
import { useGetFood } from '@/features/foods/api/use-get-food'
import { useEditFood } from '@/features/foods/api/use-edit-food'
import { useOpenFood } from '@/features/foods/hooks/use-open-food'
import { useDeleteFood } from '@/features/foods/api/use-delete-food'
import { useUndeleteFood } from '@/features/foods/api/use-undelete-food'
import { useUploadImage } from '@/features/uploads/image/api/use-upload-image'

import { FormFood } from '@/features/foods/components/form-food'

export const FormEditFood = () => {
  const [isSubmitImage, setIsSubmitImage] = useState(false)
  const { id, isOpen, onClose } = useOpenFood()

  const [ConfirmationDialog, confirm] = useConfirm(
    'Deseja realmente continuar?',
    'Após efetuar essa ação, você poderá reverter filtrando suas condições.'
  )

  const { mutateAsync: uploadImage } = useUploadImage('foods')
  const foodQuery = useGetFood(id)
  const editMutation = useEditFood(id)
  const deleteMutation = useDeleteFood(id)
  const undeleteMutation = useUndeleteFood(id)

  const isPending = editMutation.isPending || isSubmitImage

  const { data } = foodQuery

  if (!data) return null

  const defaultValues: InsertFoodFormValues = {
    name: data.name,
    image: data.image,
    description: data.description,
    price: String(data.price),
    ingredients: data.ingredients,
    promotion: String(data.promotion),
    categoryId: data.categoryId,
    additionals: data.additionals?.map(
      (additional) => additional.foodAdditionalId
    ),
  }

  const onSubmit = async (values: InsertFoodFormValues) => {
    let imageUrl: string
    const { image } = values

    try {
      if (image instanceof File) {
        setIsSubmitImage(true)
        const uploadResult = await uploadImage({
          image: image,
        })

        if (!('url' in uploadResult)) {
          throw new Error('Resposta de upload inválida')
        }
        setIsSubmitImage(false)

        imageUrl = uploadResult.url
      } else if (typeof image === 'string') {
        imageUrl = image
      } else {
        throw new Error('Tipo de imagem inválido')
      }

      editMutation.mutate(
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
