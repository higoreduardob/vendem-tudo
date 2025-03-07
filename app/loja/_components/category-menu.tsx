import Link from 'next/link'
import { Check, ChevronDown } from 'lucide-react'

import { cn } from '@/lib/utils'

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'

const categories = [
  { id: 'all', name: 'Todos os produtos' },
  { id: 'new', name: 'Lançamentos' },
  { id: 'bestsellers', name: 'Mais vendidos' },
  { id: 'promotions', name: 'Promoções' },
  { id: 'burgers', name: 'Lanches' },
  { id: 'pizzas', name: 'Pizzas' },
  { id: 'drinks', name: 'Bebidas' },
  { id: 'desserts', name: 'Sobremesas' },
  { id: 'combos', name: 'Combos' },
  { id: 'vegan', name: 'Vegano' },
]

interface CategoryMenuProps {
  className?: string
  variant?: 'sidebar' | 'dropdown'
}

export function CategoryMenu({
  className,
  variant = 'sidebar',
}: CategoryMenuProps) {
  if (variant === 'dropdown') {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[180px] justify-between">
            Categorias
            <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[180px] p-0" align="end">
          <Command>
            <CommandInput placeholder="Buscar categoria..." />
            <CommandList>
              <CommandEmpty>Nenhuma categoria encontrada.</CommandEmpty>
              <CommandGroup>
                {categories.map((category) => (
                  <CommandItem
                    key={category.id}
                    value={category.name}
                    className="cursor-pointer"
                  >
                    {category.name}
                    <Check className="ml-auto h-4 w-4 opacity-0" />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <div className={cn('rounded-lg border bg-card p-4', className)}>
      <h3 className="mb-4 text-lg font-semibold">Categorias</h3>
      <div className="space-y-1">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant="ghost"
            className="w-full justify-start"
            asChild
          >
            <Link href={`#${category.id}`}>{category.name}</Link>
          </Button>
        ))}
      </div>
    </div>
  )
}
