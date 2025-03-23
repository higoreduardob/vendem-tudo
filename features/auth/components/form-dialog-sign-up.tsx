'use client'

import { FormDialog } from '@/components/form-dialog'
import { FormSignUp } from './form-sign-up'
import { signUpDefaultValues, SignUpFormValues } from '../schema'
import { useSignUp } from '@/features/management/api/use-sign-up'
import { useNewNewSignUp } from '../hooks/use-new-sign-up'
import { useNewAdministratorStore } from '@/features/stores/hooks/use-new-store'
import { generateStrongPassword } from '@/lib/utils'

export const FormDialogSingUp = () => {
  const { isOpen, onClose } = useNewNewSignUp()
  const { onOpen } = useNewAdministratorStore()

  const mutation = useSignUp()
  const isPending = mutation.isPending
  const password = generateStrongPassword()

  const defaultValues: SignUpFormValues = {
    ...signUpDefaultValues,
    password,
    repeatPassword: password,
    role: 'OWNER',
  }

  const onSubmit = (values: SignUpFormValues) => {
    mutation.mutate(values, {
      onSuccess: (res) => {
        onClose()
        if ('token' in res && 'password' in res) {
          onOpen(res.token, res.password)
        }
      },
    })
  }

  return (
    <FormDialog
      formId="form-sign-up"
      title="Cadastrar usuário"
      description="Preencha os campos abaixo, e ao finalizar clique em “Salvar”."
      isOpen={isOpen}
      isPending={isPending}
      handleClose={onClose}
      className="max-w-3xl"
    >
      <FormSignUp
        formId="form-sign-up"
        isPending={isPending}
        defaultValues={defaultValues}
        onSubmit={onSubmit}
      />
    </FormDialog>
  )
}
