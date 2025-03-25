import { Ban, PencilRuler } from 'lucide-react'

import { useConfirm } from '@/hooks/use-confirm'
import { useOpenFood } from '@/features/foods/hooks/use-open-food'
import { useDeleteFood } from '@/features/foods/api/use-delete-food'
import { useUndeleteFood } from '@/features/foods/api/use-undelete-food'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

type Props = {
  id: string
  status: boolean
}

export const Actions = ({ id, status }: Props) => {
  const { onOpen } = useOpenFood()

  const [ConfirmationDialog, confirm] = useConfirm(
    'Deseja realmente continuar?',
    'Após efetuar essa ação, você poderá reverter filtrando suas condições.'
  )

  const deleteMutation = useDeleteFood(id)
  const undeleteMutation = useUndeleteFood(id)

  const handleDelete = async () => {
    const ok = await confirm()

    if (ok) {
      if (status) deleteMutation.mutate()
      else undeleteMutation.mutate()
    }
  }

  return (
    <>
      <ConfirmationDialog />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">Ações</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {/* <DropdownMenuItem className="cursor-pointer">
            <Eye className="size-4 mr-2" />
            Detalhes
          </DropdownMenuItem> */}
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => onOpen(id)}
          >
            <PencilRuler className="size-4 mr-2" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={handleDelete}>
            <Ban className="size-4 mr-2" />
            {status ? 'Bloquear' : 'Desbloquear'}
          </DropdownMenuItem>
          {/* <DropdownMenuItem className="cursor-pointer">
            <Download className="size-4 mr-2" />
            Exportar
          </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
