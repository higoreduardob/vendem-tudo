'use client'

import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import {
  Package,
  ShieldCheck,
  User,
  LogOut,
  Utensils,
  Store,
} from 'lucide-react'

import { useOpenStore } from '@/hooks/use-store'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Collapsible } from '@/components/ui/collapsible'
import { useCurrentUser } from '@/features/auth/hooks/use-current-user'
import Image from 'next/image'

export function AppSidebar() {
  const pathname = usePathname()
  const { store } = useOpenStore()
  const { user } = useCurrentUser()

  if (!store) return null

  const DASHBOARD_NAV_MAIN = [
    {
      title: 'Minha Conta',
      href: `/loja/${store.slug}/conta`,
      icon: User,
    },
    {
      title: 'Meus Pedidos',
      href: `/loja/${store.slug}/conta/pedidos`,
      icon: Package,
    },
    // {
    //   title: 'Favoritos',
    //   href: `/loja/${store.slug}/conta/favoritos`,
    //   icon: Heart,
    // },
    {
      title: 'Segurança',
      href: `/loja/${store.slug}/conta/seguranca`,
      icon: ShieldCheck,
    },
    {
      title: 'Cardápio',
      href: `/loja/${store.slug}`,
      icon: Utensils,
    },
  ]

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href={`/loja/${store.slug}`}>
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
                  <span className="truncate font-semibold">{store.name}</span>
                  <span className="truncate text-xs">{user?.name}</span>
                </div>

                <Store className="ml-auto" />
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Gestão</SidebarGroupLabel>
          <SidebarMenu className="flex flex-col gap-2">
            {DASHBOARD_NAV_MAIN.map((item, index) => (
              <Collapsible key={index}>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.title}
                  >
                    <Link href={item.href}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="py-2 px-0">
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              <Collapsible>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    variant="outline"
                    onClick={() => signOut()}
                  >
                    <LogOut className="h-5 w-5" />
                    Sair
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </SidebarFooter>
    </Sidebar>
  )
}
