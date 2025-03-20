import Link from 'next/link'

export const Footer = () => {
  return (
    <footer className="flex flex-wrap items-center justify-center gap-4 py-4 text-sm text-muted-foreground">
      <span>© {new Date().getFullYear()} Vendem Tudo</span>
      <Link href="/politicas-de-privacidade" className="hover:text-foreground">
        Políticas de privacidade
      </Link>
      <Link href="/sobre-nos" className="hover:text-foreground">
        Sobre nós
      </Link>
      <Link href="/suporte" className="hover:text-foreground">
        Suporte
      </Link>
    </footer>
  )
}
