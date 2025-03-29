'use client'

import { mapSessionToUpdateData } from '@/lib/utils'

import { UpdateFormValues } from '@/features/auth/schema'

import { useUpdate } from '@/features/auth/api/use-update'
import { useCurrentUser } from '@/features/auth/hooks/use-current-user'

import { Title } from '@/app/(protected)/_components/title'
import { FormUpdate } from '@/features/auth/components/form-update'

export default function AccountPage() {
  const { user, update } = useCurrentUser()

  if (!user) return null

  const mutation = useUpdate(user.id)
  const isPending = mutation.isPending

  const onSubmit = (values: UpdateFormValues) => {
    mutation.mutate(values, {
      onSuccess: async () => {
        await update()
      },
    })
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <Title>Conta</Title>
      <p className="text-sm text-muted-foreground">
        Preencha os campos abaixo, e ao finalizar clique em “Salvar”.
      </p>
      <FormUpdate
        isPending={isPending}
        defaultValues={mapSessionToUpdateData(user)}
        onSubmit={onSubmit}
      />
    </div>
  )
}
