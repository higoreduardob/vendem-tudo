import {
  MoreHorizontal,
  Ban,
  PencilRuler,
  Printer,
  PackageCheck,
} from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

type Props = {
  id: string
}

export const Actions = ({ id }: Props) => {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem className="cursor-pointer">
            <Printer className="size-4 mr-2" />
            Imprimir
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <PencilRuler className="size-4 mr-2" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Ban className="size-4 mr-2" />
            Cancelar
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <PackageCheck className="size-4 mr-2" />
            Entregue
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
