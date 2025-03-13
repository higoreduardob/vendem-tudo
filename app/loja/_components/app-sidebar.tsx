'use client'

import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { Package, ShieldCheck, User, LogOut } from 'lucide-react'

import { useOpenStore } from '@/hooks/use-store'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Collapsible } from '@/components/ui/collapsible'

export function AppSidebar() {
  const pathname = usePathname()
  const { store } = useOpenStore()

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
  ]

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
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
      <SidebarFooter className="border-t py-2 px-0">
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
