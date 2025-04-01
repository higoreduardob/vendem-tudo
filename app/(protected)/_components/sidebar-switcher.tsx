import Image from 'next/image'
import { ChevronsUpDown, Settings } from 'lucide-react'

import { useGetStores } from '@/features/stores/api/use-get-stores'
// import { useNewStore } from '@/features/stores/hooks/use-new-store'
import { useOpenStore } from '@/features/stores/hooks/use-open-store'

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  // DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function SidebarSwitcher({
  name,
  storeName,
}: {
  name: string
  storeName: string
}) {
  const { isMobile } = useSidebar()
  const { onOpen: onOpenEditStore } = useOpenStore()
  // const { onOpen: onOpenNewStore } = useNewStore()
  const storesQuery = useGetStores()
  const stores = storesQuery.data || []

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Image
                src="/logo-light.svg"
                alt="Vendem Tudo"
                width={32}
                height={32}
              />

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{name}</span>
                <span className="truncate text-xs">{storeName}</span>
              </div>

              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Lojas
            </DropdownMenuLabel>
            {stores.length > 0 ? (
              stores.map((store, index) => (
                <DropdownMenuItem
                  key={index}
                  className="p-2 cursor-pointer"
                  onClick={() => onOpenEditStore(store.id)}
                >
                  {store.name} <Settings className="ml-auto" />
                </DropdownMenuItem>
              ))
            ) : (
              <span className="block text-sm text-muted-foreground text-center p-2">
                Nenuma loja cadastrada
              </span>
            )}
            {/* <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 p-2 cursor-pointer"
              onClick={onOpenNewStore}
            >
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">Loja</div>
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
