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
import { Container } from '@/components/container'

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container className="flex items-center py-4">
        <Link href="/">
          <Image
            src="/logo-light.svg"
            alt="Vendem Tudo"
            width={32}
            height={32}
          />
        </Link>

        {/* Desktop Menu */}
        <NavigationMenu className="hidden md:flex mx-6">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref>
                <Button variant="ghost" size="sm">
                  Início
                </Button>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/suporte" legacyBehavior passHref>
                <Button variant="ghost" size="sm">
                  Suporte
                </Button>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-transparent hover:bg-accent hover:text-accent-foreground text-xs">
                Recursos
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="p-2">
                  <Link href="/sobre-nos">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex justify-start w-full"
                    >
                      Sobre nós
                    </Button>
                  </Link>
                  <Link href="/termos-de-uso">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex justify-start w-full"
                    >
                      Termos de uso
                    </Button>
                  </Link>
                  <Link href="/politicas-de-privacidade">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex justify-start w-full"
                    >
                      Políticas de privacidade
                    </Button>
                  </Link>
                  {/* <Link href="/demonstracoes">
                    <Button variant="ghost" size="sm" className="flex justify-start w-full">
                      Demonstrações
                    </Button>
                  </Link> */}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        {/* Mobile Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="md:hidden mx-6">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Opções</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="grid grid-cols-1 mx-6">
            <DropdownMenuItem asChild>
              <Link href="/" legacyBehavior passHref>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex justify-start"
                >
                  Início
                </Button>
              </Link>
            </DropdownMenuItem>
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
                <Link href="/sobre-nos">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex justify-start w-full"
                  >
                    Sobre
                  </Button>
                </Link>
                <Link href="/termos-de-uso">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex justify-start w-full"
                  >
                    Termos de uso
                  </Button>
                </Link>
                <Link href="/politicas-de-privacidade">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex justify-start w-full"
                  >
                    Políticas de privacidade
                  </Button>
                </Link>
                {/* <Link href="/demonstracoes">
                  <Button variant="ghost" size="sm" className="flex justify-start w-full">
                    Demonstrações
                  </Button>
                </Link> */}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>

          <div className="flex items-center ml-auto space-x-4">
            <Link href="/entrar">
              <Button size="sm">Entrar</Button>
            </Link>
            <Link href="/planos">
              <Button size="sm" variant="purple">
                Cadastrar
              </Button>
            </Link>
          </div>
        </DropdownMenu>
      </Container>
    </header>
  )
}
