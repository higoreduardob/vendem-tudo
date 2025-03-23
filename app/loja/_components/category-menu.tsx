import { Check, ChevronDown } from 'lucide-react'

import { useOpenStore } from '@/hooks/use-store'
import { useSearchFood } from '@/features/foods/hooks/use-filter-food'
import { useGetStoreCategories } from '@/features/foods/categories/api/use-get-categories'

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

export const CategoryMenu = () => {
  const { store } = useOpenStore()

  if (!store) {
    return null
  }

  const categoriesQuery = useGetStoreCategories(store?.id)
  const categories = categoriesQuery.data || []
  const { categoryId, search, onChange } = useSearchFood()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[180px] justify-between">
          {categories.find((category) => category.id === categoryId)?.name ||
            'Categorias'}
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
                  onSelect={() => onChange(category.id, search)}
                  className="cursor-pointer"
                >
                  {category.name}
                  {category.id === categoryId && (
                    <Check className="ml-auto h-4 w-4 opacity-100" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
