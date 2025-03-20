import {
  InstagramLogoIcon,
  LinkedInLogoIcon,
  TwitterLogoIcon,
} from '@radix-ui/react-icons'
import Link from 'next/link'

export const Footer = () => {
  return (
    <footer className="backdrop-blur bg-background/95 border-t supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-10 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Sobre Nós</h3>
            <p className="text-muted-foreground text-sm">
              Plataforma completa para delivery e gestão de pedidos online,
              conectando lojistas e clientes.
            </p>
            <div className="flex space-x-4">
              <Link href="#">
                <InstagramLogoIcon className="h-5 w-5" />
              </Link>
              <Link href="#">
                <TwitterLogoIcon className="h-5 w-5" />
              </Link>
              <Link href="#">
                <LinkedInLogoIcon className="h-5 w-5" />
              </Link>
            </div>
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
                href="/"
                className="text-muted-foreground text-sm hover:text-purple-950"
              >
                Planos
              </Link>
              <Link
                href="/"
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
                href="/"
                className="text-muted-foreground text-sm hover:text-purple-950"
              >
                Termos de uso
              </Link>
              <Link
                href="/"
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
                href="/"
                className="text-muted-foreground text-sm hover:text-purple-950"
              >
                Suporte
              </Link>
              <Link
                href="/"
                className="text-muted-foreground text-sm hover:text-purple-950"
              >
                Demonstração
              </Link>
              <Link
                href="/"
                className="text-muted-foreground text-sm hover:text-purple-950"
              >
                (11) 9 9999-9999
              </Link>
            </div>
          </div>
        </div>

        <p className="border-t pt-6 text-center text-muted-foreground text-sm">
          <span>© {new Date().getFullYear()} Vendem Tudo</span>. Todos os
          direitos reservados.
        </p>
      </div>
    </footer>
  )
}
