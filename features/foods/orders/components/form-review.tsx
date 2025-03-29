'use client'

import { Star } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'

import { useNewReview } from '@/features/foods/orders/hooks/use-new-review'
import { useCreateReview } from '@/features/foods/orders/api/use-create-review'

import {
  InsertReviewFormValues,
  insertReviewSchema,
} from '@/features/foods/orders/schema'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { FormDialog } from '@/components/form-dialog'

type Props = {
  isOpen: boolean
  isPending?: boolean
  handleClose: () => void
  onSubmit: (values: InsertReviewFormValues) => void
}

export const FormNewReview = () => {
  const { id, itemId, isOpen, onClose } = useNewReview()

  const mutation = useCreateReview(id, itemId)
  const isPending = mutation.isPending

  const onSubmit = (values: InsertReviewFormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        onClose()
      },
    })
  }

  return (
    <FormReview
      isOpen={isOpen}
      isPending={isPending}
      handleClose={onClose}
      onSubmit={onSubmit}
    />
  )
}

export const FormReview = ({
  isOpen,
  isPending,
  handleClose,
  onSubmit,
}: Props) => {
  const [hoveredRating, setHoveredRating] = useState<number>(0)
  const form = useForm<InsertReviewFormValues>({
    resolver: zodResolver(insertReviewSchema),
    shouldFocusError: true,
    reValidateMode: 'onChange',
    mode: 'all',
  })

  const handleSubmit = (values: InsertReviewFormValues) => {
    onSubmit(values)
  }

  useEffect(() => {
    form.reset()
  }, [isOpen])

  return (
    <FormDialog
      formId="form-review"
      title="Avalie seu pedido"
      description="Conte-nos o que achou do seu item. Sua opinião é importante para nós!"
      isOpen={isOpen}
      isPending={isPending}
      handleClose={handleClose}
      className="max-w-[90%] md:max-w-xl"
    >
      <Form {...form}>
        <form
          id="form-review"
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <FormField
            control={form.control}
            name="review"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex flex-col items-center py-6">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => field.onChange(star)}
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                          className="focus:outline-none transition-transform hover:scale-110"
                        >
                          <Star
                            size={36}
                            className={`
                    ${
                      hoveredRating >= star ||
                      (!hoveredRating && field.value >= star)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }
                    transition-colors
                  `}
                          />
                        </button>
                      ))}
                    </div>

                    <div className="text-center text-sm font-medium">
                      {field.value === 1 && 'Muito ruim'}
                      {field.value === 2 && 'Ruim'}
                      {field.value === 3 && 'Regular'}
                      {field.value === 4 && 'Bom'}
                      {field.value === 5 && 'Excelente'}
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </FormDialog>
  )
}
