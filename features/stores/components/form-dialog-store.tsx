import { InsertStoreFormValues } from '@/features/stores/schema'

import { FormDialog } from '@/components/form-dialog'
import { FormStore } from '@/features/stores/components/form-store'

type Props = {
  id?: string
  isOpen: boolean
  isPending?: boolean
  status?: boolean
  defaultValues: InsertStoreFormValues
  onDelete?: () => void
  handleClose: () => void
  onSubmit: (values: InsertStoreFormValues) => void
}

export const FormDialogStore = ({
  id,
  isOpen,
  isPending,
  status,
  defaultValues,
  onDelete,
  handleClose,
  onSubmit,
}: Props) => {
  return (
    <FormDialog
      id={id}
      formId="form-store"
      title={id ? 'Editar loja' : 'Nova loja'}
      description="Preencha os campos abaixo, e ao finalizar clique em “Salvar”."
      isOpen={isOpen}
      isPending={isPending}
      status={status}
      onDelete={onDelete}
      handleClose={handleClose}
      className="max-w-[90%] md:max-w-3xl"
    >
      <FormStore
        isOpen={isOpen}
        isPending={isPending}
        defaultValues={defaultValues}
        onSubmit={onSubmit}
      />
    </FormDialog>
  )
}
