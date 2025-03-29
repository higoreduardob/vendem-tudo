'use client'

import Link from 'next/link'
import { Box, LayoutDashboard, ShoppingCart, Store, Users } from 'lucide-react'

import { useCurrentUser } from '@/features/auth/hooks/use-current-user'
import { useGetOrders } from '@/features/foods/orders/api/use-get-orders'

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { AppSidebar } from '@/app/(protected)/_components/app-sidebar'
import { NotificationManager } from '@/components/notification-manager'
import { SmartBreadcrumb } from '@/app/(protected)/_components/smart-breadcrumb'

// import { Switch } from '@/components/ui/switch'
// import { ButthonTheme } from '@/components/button-custom'

const DASHBOARD_NAV_MAIN = [
  {
    title: 'Painel',
    url: '/plataforma',
    icon: LayoutDashboard,
    isActive: true,
    // items: [
    //   {
    //     title: 'Desempenho',
    //     url: '/plataforma/desempenho',
    //   },
    //   {
    //     title: 'Automação',
    //     url: '/plataforma/automacao',
    //   },
    // ],
  },
  {
    title: 'Alimentos',
    url: '/plataforma/alimentos',
    icon: Box,
    isActive: false,
    items: [
      {
        title: 'Categorias',
        url: '/plataforma/alimentos/categorias',
      },
      // {
      //   title: 'Inventário',
      //   url: '/plataforma/alimentos/inventario',
      // },
      // {
      //   title: 'Descontos',
      //   url: '/plataforma/produtos/descontos',
      // },
    ],
  },
  {
    title: 'Pedidos',
    url: '/plataforma/pedidos',
    icon: ShoppingCart,
    isActive: false,
  },
  {
    title: 'Clientes',
    url: '/plataforma/clientes',
    icon: Users,
    isActive: false,
  },
]

const USER_NAV_MAIN = [
  // {
  //   title: 'Suporte',
  //   url: '/plataforma/suporte',
  //   isActive: false,
  //   items: undefined,
  // },
  {
    title: 'Conta',
    url: '/plataforma/conta',
    isActive: false,
    items: undefined,
  },
  {
    title: 'Segurança',
    url: '/plataforma/seguranca',
    isActive: false,
    items: undefined,
  },
  // {
  //   title: 'Planos',
  //   url: '/plataforma/planos',
  //   isActive: false,
  //   items: undefined,
  // },
  // {
  //   title: 'Notificações',
  //   url: '/plataforma/notificacoes',
  //   isActive: false,
  //   items: undefined,
  // },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useCurrentUser()
  const ordersQuery = useGetOrders(true)
  const orders = ordersQuery.data || []
  const ordersPending = orders.filter(
    (order) => order.histories[0].orderHistory.progress === 'PENDING'
  )

  const navMainForBreadcrumb = DASHBOARD_NAV_MAIN.map(({ icon, ...rest }) => ({
    ...rest,
    items: rest.items?.map(({ url, title }) => ({ url, title })),
  })).concat(USER_NAV_MAIN)

  return (
    <SidebarProvider>
      <AppSidebar
        user={{
          name: user?.name,
          email: user?.email,
          image: user?.image,
          selectedStore: user?.selectedStore,
        }}
        navMain={DASHBOARD_NAV_MAIN}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex justify-between items-center gap-2 px-4 w-full">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <SmartBreadcrumb navMain={navMainForBreadcrumb} />
            </div>
            <div className="flex items-center gap-2">
              {/* <ButthonTheme /> */}
              {/* <Separator orientation="vertical" className="mr-2 h-4" /> */}
              <NotificationManager
                ordersPending={ordersPending}
                dataUpdatedAt={ordersQuery.dataUpdatedAt}
              />
              {/* <Separator orientation="vertical" className="mr-2 h-4" /> */}
              <Link href={`/loja/${user?.selectedStore?.slug}`}>
                <Button variant="ghost">
                  <Store className="h-[1.2rem] w-[1.2rem]" />
                </Button>
              </Link>
              {/* TODO: Check handleOpenStore */}
              {/* <Separator orientation="vertical" className="mr-2 h-4" /> */}
              {/* <Switch checked={field.value} onCheckedChange={field.onChange} /> */}
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
