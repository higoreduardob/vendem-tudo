'use client'

import Link from 'next/link'
import Image from 'next/image'
import { signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'

import { Users, ShieldCheck, User, LogOut, Store } from 'lucide-react'

import { useCurrentUser } from '@/features/auth/hooks/use-current-user'

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

export function AppSidebar() {
  const pathname = usePathname()
  const { user } = useCurrentUser()

  const DASHBOARD_NAV_MAIN = [
    {
      title: 'Gestão',
      href: '/gestao',
      icon: Store,
    },
    {
      title: 'Minha Conta',
      href: '/gestao/conta',
      icon: User,
    },
    {
      title: 'Usuários',
      href: '/gestao/usuarios',
      icon: Users,
    },
    {
      title: 'Segurança',
      href: '/gestao/seguranca',
      icon: ShieldCheck,
    },
  ]

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/gestao">
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
                  <span className="truncate font-semibold">Vendem Tudo</span>
                  <span className="truncate text-xs">{user?.name}</span>
                </div>
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
