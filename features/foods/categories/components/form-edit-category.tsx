'use client'

import { toast } from 'sonner'
import { useState } from 'react'

import { InsertCategoryFormValues } from '@/features/foods/categories/schema'

import { useConfirm } from '@/hooks/use-confirm'
import { useUploadImage } from '@/features/uploads/image/api/use-upload-image'
import { useGetCategory } from '@/features/foods/categories/api/use-get-category'
import { useEditCategory } from '@/features/foods/categories/api/use-edit-category'
import { useOpenCategory } from '@/features/foods/categories/hooks/use-open-category'
import { useDeleteCategory } from '@/features/foods/categories/api/use-delete-category'
import { useUndeleteCategory } from '@/features/foods/categories/api/use-undelete-category'

import { FormCategory } from '@/features/foods/categories/components/form-category'

export const FormEditCategory = () => {
  const [isSubmitImage, setIsSubmitImage] = useState(false)
  const { id, isOpen, onClose } = useOpenCategory()

  const [ConfirmationDialog, confirm] = useConfirm(
    'Deseja realmente continuar?',
    'Após efetuar essa ação, você poderá reverter filtrando suas condições.'
  )

  const { mutateAsync: uploadImage } = useUploadImage('food-categories')
  const categoryQuery = useGetCategory(id)
  const editMutation = useEditCategory(id)
  const deleteMutation = useDeleteCategory(id)
  const undeleteMutation = useUndeleteCategory(id)

  const isPending = editMutation.isPending || isSubmitImage

  const { data } = categoryQuery

  if (!data) return null

  const defaultValues: InsertCategoryFormValues = {
    name: data.name,
    image: data.image,
  }

  const onSubmit = async (values: InsertCategoryFormValues) => {
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
      <FormCategory
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
