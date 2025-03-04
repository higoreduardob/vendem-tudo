import { useGetStores } from '@/features/stores/api/use-get-stores'
import { useActiveNav } from '@/app/(protected)/_hooks/use-active-nav'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { NavUser, UserProps } from '@/app/(protected)/_components/nav-user'
import { NavMain, NavMainProps } from '@/app/(protected)/_components/nav-main'
import { SidebarSwitcher } from '@/app/(protected)/_components/sidebar-switcher'

export function AppSidebar({
  navMain,
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & NavMainProps & UserProps) {
  const updatedNavMain = useActiveNav({ navMain })
  const storesQuery = useGetStores()
  const stores = storesQuery.data || []
  const storeName = stores.find(
    (store) => store.id === user?.selectedStore
  )?.name

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarSwitcher
          name="Vendem Tudo"
          storeName={storeName || 'Plataforma'}
        />
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea>
          <NavMain title="Gestão" navMain={updatedNavMain} />
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
