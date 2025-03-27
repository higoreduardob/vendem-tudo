// import {
//   InstagramLogoIcon,
//   LinkedInLogoIcon,
//   TwitterLogoIcon,
// } from '@radix-ui/react-icons'
import Link from 'next/link'

import { Container } from '@/components/container'

export const Footer = () => {
  return (
    <footer className="backdrop-blur bg-background/95 border-t supports-[backdrop-filter]:bg-background/60">
      <Container className="py-4 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Sobre Nós</h3>
            <p className="text-muted-foreground text-sm">
              Plataforma completa para delivery e gestão de pedidos online,
              conectando lojistas e clientes.
            </p>
            {/* TODO: Create social accounts */}
            {/* <div className="flex space-x-4">
              <Link href="#">
                <InstagramLogoIcon className="h-5 w-5" />
              </Link>
              <Link href="#">
                <TwitterLogoIcon className="h-5 w-5" />
              </Link>
              <Link href="#">
                <LinkedInLogoIcon className="h-5 w-5" />
              </Link>
            </div> */}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Links Rápidos</h3>
            <div className="flex flex-col gap-2">
              <Link
                href="/"
                className="text-muted-foreground text-sm hover:text-purple-950"
              >
                Início
              </Link>
              <Link
                href="/planos"
                className="text-muted-foreground text-sm hover:text-purple-950"
              >
                Cadastrar
              </Link>
              <Link
                href="/sobre-nos"
                className="text-muted-foreground text-sm hover:text-purple-950"
              >
                Sobre nós
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Legal</h3>
            <div className="flex flex-col gap-2">
              <Link
                href="/termos-de-uso"
                className="text-muted-foreground text-sm hover:text-purple-950"
              >
                Termos de uso
              </Link>
              <Link
                href="/politicas-de-privacidade"
                className="text-muted-foreground text-sm hover:text-purple-950"
              >
                Políticas de privacidade
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Fale conosco</h3>
            <div className="flex flex-col gap-2">
              <Link
                href="/suporte"
                className="text-muted-foreground text-sm hover:text-purple-950"
              >
                Suporte
              </Link>
              <Link
                href="/"
                className="text-muted-foreground text-sm hover:text-purple-950"
              >
                (11) 9 9999-9999
              </Link>
              {/* <Link
                href="/demonstracoes"
                className="text-muted-foreground text-sm hover:text-purple-950"
              >
                Demonstração
              </Link> */}
            </div>
          </div>
        </div>

        <p className="border-t text-center text-muted-foreground text-sm pt-6 pb-2">
          <span>© {new Date().getFullYear()} Vendem Tudo</span>. Todos os
          direitos reservados.
        </p>
      </Container>
    </footer>
  )
}
