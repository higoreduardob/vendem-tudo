'use client'

import { useNewNewSignUp } from '@/features/auth/hooks/use-new-sign-up'

import { Button } from '@/components/ui/button'

export const Actions = () => {
  const { onOpen } = useNewNewSignUp()

  return (
    <div className="flex items-center gap-2">
      <Button onClick={onOpen}>Adicionar</Button>
    </div>
  )
}
