'use client'

import { useNewCategory } from '@/features/foods/categories/hooks/use-new-category'

import { Button } from '@/components/ui/button'

export const Actions = () => {
  const { onOpen } = useNewCategory()

  return (
    <div className="flex items-center gap-2 w-full">
      <Button onClick={onOpen} className="w-full">
        Adicionar
      </Button>
    </div>
  )
}
