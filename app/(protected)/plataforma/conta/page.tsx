'use client'

import { mapSessionToUpdateData } from '@/lib/utils'

import { UpdateFormValues } from '@/features/auth/schema'

import { useUpdate } from '@/features/auth/api/use-update'
import { useUpdate2fa } from '@/features/auth/api/use-update-2fa'
import { useCurrentUser } from '@/features/auth/hooks/use-current-user'

import { Title } from '@/app/(protected)/_components/title'
import { Form2FA, FormUpdate } from '@/features/auth/components/form-update'

export default function AccountPage() {
  const { user, update } = useCurrentUser()

  if (!user) return null

  const { id, isTwoFactorEnabled } = user
  const mutationUpdate = useUpdate(id)
  const mutation2fa = useUpdate2fa(id)

  const onSubmitUpdate = (values: UpdateFormValues) => {
    mutationUpdate.mutate(values, {
      onSuccess: async () => {
        await update()
      },
    })
  }

  const onSubmit2fa = () =>
    mutation2fa.mutate(
      { param: { id } },
      {
        onSuccess: async () => {
          update()
          // signIn(isOauth ? 'google' : 'credentials', {
          //   redirect: false,
          // })
        },
      }
    )

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <Title>Conta</Title>
        <Form2FA
          isTwoFactorEnabled={isTwoFactorEnabled}
          isPending={mutation2fa.isPending}
          onSubmit={onSubmit2fa}
        />
      </div>
      <p className="text-sm text-muted-foreground">
        Preencha os campos abaixo, e ao finalizar clique em “Salvar”.
      </p>
      <FormUpdate
        isPending={mutationUpdate.isPending}
        defaultValues={mapSessionToUpdateData(user)}
        onSubmit={onSubmitUpdate}
      />
    </div>
  )
}
