import Link from 'next/link'
import { FileText } from 'lucide-react'

import { Button } from '@/components/ui/button'

export const Cta = () => {
  return (
    <div className="space-y-20">
      {/* CTA Final Section */}
      <section className="bg-purple-50">
        <div className="container mx-auto px-4 text-center py-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto para vender mais? Cadastre sua loja agora e comece hoje
            mesmo!
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de lojistas que já estão aumentando suas vendas
            com nossa plataforma.
          </p>
          <Link href="/cadastrar">
            <Button size="lg" variant="purple">
              <FileText className="mr-2 h-5 w-5" />
              Cadastrar
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
