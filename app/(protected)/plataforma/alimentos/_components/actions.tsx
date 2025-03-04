'use client'

import { Barcode, ChevronDown, Download, FilePlus, Upload } from 'lucide-react'

import { useNewFood } from '@/features/foods/hooks/use-new-food'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

export const Actions = () => {
  const { onOpen } = useNewFood()

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" className="hidden sm:flex">
        <Download className="mr-2 h-4 w-4" />
        Exportar
      </Button>
      <Button variant="outline" className="hidden sm:flex">
        <Upload className="mr-2 h-4 w-4" />
        Importar
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="sm:hidden">
          <Button variant="outline">
            Opções
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem className="sm:hidden">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </DropdownMenuItem>
          <DropdownMenuItem className="sm:hidden">
            <Upload className="mr-2 h-4 w-4" />
            Importar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>Adicionar</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onOpen}>
            <FilePlus className="mr-2 h-4 w-4" />
            Cadastro manual
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Barcode className="mr-2 h-4 w-4" />
            Nota fiscal
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
