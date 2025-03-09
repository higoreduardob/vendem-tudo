'use client'

import { mapSessionToUpdateData } from '@/lib/utils'

import { UpdateFormValues } from '@/features/auth/schema'

import { useUpdate } from '@/features/auth/api/use-update'
import { useUpdate2fa } from '@/features/auth/api/use-update-2fa'
import { useCurrentUser } from '@/features/auth/hooks/use-current-user'

import { Switch } from '@/components/ui/switch'
import { MockForm } from '@/components/mock-form'
import { ButtonLoading } from '@/components/button-custom'
import { FormUser } from '@/features/users/components/form-user'
import { FormControl, FormItem, FormLabel } from '@/components/ui/form'

export const FormUpdate = () => {
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

  const handleSubmit = () => {
    document
      .getElementById('form-user')
      ?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
  }

  return (
    <>
      <FormUser
        formId="form-user"
        defaultValues={mapSessionToUpdateData(user)}
        isPending={isPending}
        onSubmit={onSubmit}
      />
      {/* TODO: Fix refresh page */}
      <ButtonLoading
        type="button"
        onClick={handleSubmit}
        disabled={isPending}
        className="w-fit"
      >
        Salvar
      </ButtonLoading>
    </>
  )
}

export const Form2FA = () => {
  const { user, update } = useCurrentUser()

  if (!user) return null

  const { id, isTwoFactorEnabled } = user

  const mutation = useUpdate2fa(user.id)

  return (
    <MockForm>
      <FormItem className="flex items-center gap-3">
        <FormLabel htmlFor="2FA" className="mt-2">
          Autenticação de dois fatores
        </FormLabel>
        <FormControl>
          <Switch
            id="2FA"
            checked={isTwoFactorEnabled}
            disabled={mutation.isPending}
            onCheckedChange={() =>
              mutation.mutate(
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
            }
          />
        </FormControl>
      </FormItem>
    </MockForm>
  )
}
