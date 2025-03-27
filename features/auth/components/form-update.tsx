import { UpdateFormValues } from '@/features/auth/schema'

import { Switch } from '@/components/ui/switch'
import { MockForm } from '@/components/mock-form'
import { FormDialog } from '@/components/form-dialog'
import { ButtonLoading } from '@/components/button-custom'
import { FormUser } from '@/features/users/components/form-user'
import { FormControl, FormItem, FormLabel } from '@/components/ui/form'

type FormUpdateProps = {
  isPending?: boolean
  defaultValues: UpdateFormValues
  onSubmit: (values: UpdateFormValues) => void
}

export const FormUpdate = ({
  isPending,
  defaultValues,
  onSubmit,
}: FormUpdateProps) => {
  const handleSubmit = () => {
    document
      .getElementById('form-user')
      ?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
  }

  return (
    <>
      <FormUser
        formId="form-user"
        defaultValues={defaultValues}
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

type Form2FAProps = {
  isTwoFactorEnabled?: boolean
  isPending?: boolean
  onSubmit: () => void
}

export const Form2FA = ({
  isTwoFactorEnabled,
  isPending,
  onSubmit,
}: Form2FAProps) => {
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
            disabled={isPending}
            onCheckedChange={onSubmit}
          />
        </FormControl>
      </FormItem>
    </MockForm>
  )
}

type FormDialogUpdateProps = {
  isOpen: boolean
  defaultValues: UpdateFormValues
  isPending?: boolean
  handleClose: () => void
  onSubmit: (values: UpdateFormValues) => void
}

export const FormDialogUpdate = ({
  isOpen,
  defaultValues,
  isPending,
  handleClose,
  onSubmit,
}: FormDialogUpdateProps) => {
  return (
    <FormDialog
      formId="form-user"
      title="Atualizar informações da conta"
      description="Preencha os campos abaixo, e ao finalizar clique em “Salvar”."
      isOpen={isOpen}
      isPending={isPending}
      handleClose={handleClose}
      className="max-w-[90%] md:max-w-[700px]"
    >
      <FormUser
        formId="form-user"
        defaultValues={defaultValues}
        isPending={isPending}
        onSubmit={onSubmit}
      />
    </FormDialog>
  )
}
