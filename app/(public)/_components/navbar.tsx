import Link from 'next/link'
import Image from 'next/image'
import { Menu } from 'lucide-react'

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/logo-light.svg"
            alt="Vendem Tudo"
            width={32}
            height={32}
          />
        </Link>

        <NavigationMenu className="hidden md:flex mx-6">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/planos" legacyBehavior passHref>
                <Button variant="ghost" size="sm">
                  Planos
                </Button>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-transparent hover:bg-accent hover:text-accent-foreground">
                Recursos
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="p-2">
                  <Link href="/sobre">
                    <Button variant="ghost" size="sm" className="w-full">
                      Sobre
                    </Button>
                  </Link>
                  <Link href="/demonstracoes">
                    <Button variant="ghost" size="sm" className="w-full">
                      Demonstrações
                    </Button>
                  </Link>
                  <Link href="/politicas-privacidade">
                    <Button variant="ghost" size="sm" className="w-full">
                      Políticas de privacidade
                    </Button>
                  </Link>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/suporte" legacyBehavior passHref>
                <Button variant="ghost" size="sm">
                  Suporte
                </Button>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild className="md:hidden mx-6">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Opções</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="grid grid-cols-1 mx-6">
            <DropdownMenuItem asChild>
              <Link href="/planos" legacyBehavior passHref>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex justify-start"
                >
                  Planos
                </Button>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSub>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="flex justify-start"
              >
                <DropdownMenuSubTrigger>Recursos</DropdownMenuSubTrigger>
              </Button>
              <DropdownMenuSubContent className="grid grid-cols-1">
                <Link href="/sobre">
                  <Button variant="ghost" size="sm" className="w-full">
                    Sobre
                  </Button>
                </Link>
                <Link href="/demonstracoes">
                  <Button variant="ghost" size="sm" className="w-full">
                    Demonstrações
                  </Button>
                </Link>
                <Link href="/politicas-privacidade">
                  <Button variant="ghost" size="sm" className="w-full">
                    Políticas de privacidade
                  </Button>
                </Link>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuItem asChild>
              <Link href="/suporte" legacyBehavior passHref>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex justify-start"
                >
                  Suporte
                </Button>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center ml-auto space-x-4">
          <Link href="/entrar">
            <Button size="sm">Entrar</Button>
          </Link>
          <Link href="/cadastrar">
            <Button size="sm" variant="purple">
              Cadastrar
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
