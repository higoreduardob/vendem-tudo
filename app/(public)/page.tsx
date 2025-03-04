import Link from 'next/link'

import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <main className="min-h-[calc(100vh-117px)]">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tighter">
            Vendem Tudo
            <br />
            para seu negócio
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-[600px]">
            Deixe a inteligência artificial trabalhar para você, faça mais
            vendas no automático.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/cadastrar">
              <Button size="lg">Cadastrar</Button>
            </Link>
            <Link href="/entrar">
              <Button size="lg" variant="outline">
                Entrar
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
