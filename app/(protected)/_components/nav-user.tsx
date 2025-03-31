'use client'

import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { BadgeCheck, ChevronsUpDown, Lock, LogOut, User } from 'lucide-react'

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export type UserProps = {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
    selectedStore?: { id: string; name: string; slug: string } | null
  }
}

export function NavUser({ user }: UserProps) {
  const { isMobile } = useSidebar()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.image || ''} alt={user.name || 'User'} />
                <AvatarFallback className="rounded-lg">
                  <User />
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={user.image || ''}
                    alt={user.name || 'User'}
                  />
                  <AvatarFallback className="rounded-lg">
                    <User />
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {/* <DropdownMenuGroup>
              <Link href="/plataforma/suporte">
                <DropdownMenuItem className="cursor-pointer">
                  <Sparkles />
                  Suporte
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup> */}
            {/* <DropdownMenuSeparator /> */}
            <DropdownMenuGroup>
              <Link href="/plataforma/conta">
                <DropdownMenuItem className="cursor-pointer">
                  <BadgeCheck />
                  Conta
                </DropdownMenuItem>
              </Link>
              <Link href="/plataforma/seguranca">
                <DropdownMenuItem className="cursor-pointer">
                  <Lock />
                  Segurança
                </DropdownMenuItem>
              </Link>
              {/* <Link href="/plataforma/planos">
                <DropdownMenuItem className="cursor-pointer">
                  <CreditCard />
                  Planos
                </DropdownMenuItem>
              </Link>
              <Link href="/plataforma/notificacoes">
                <DropdownMenuItem className="cursor-pointer">
                  <Bell />
                  Notificações
                </DropdownMenuItem>
              </Link> */}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => signOut()}
            >
              <LogOut />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
