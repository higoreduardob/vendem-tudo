import {
  Check,
  Smartphone,
  LayoutGrid,
  BarChart3,
  ShoppingCart,
  Image as ImageIcon,
  Users,
  FileStack,
} from 'lucide-react'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'

export const Plans = () => {
  return (
    <Card className="mx-auto overflow-hidden rounded-xl border-0 bg-purple-50">
      <CardHeader className="p-6">
        <div className="flex justify-center">
          <Badge variant="destructive">Oferta de Lançamento</Badge>
        </div>
        <h2 className="text-center text-2xl font-bold">Plano Completo</h2>
        <div className="mt-4 flex items-baseline justify-center">
          <span className="text-5xl font-extrabold">R$149,90</span>
          <span className="ml-2 text-xl text-gray-400 line-through">
            R$199,90
          </span>
          <span className="ml-2 text-gray-400">/mês</span>
        </div>
        <p className="mt-4 text-center text-gray-400">
          Tudo que você precisa para gerenciar seu cardápio digital
        </p>
      </CardHeader>

      <CardContent className="p-6 flex flex-row gap-6 items-start">
        <div className="flex-1 h-full space-y-4">
          <h3 className="text-sm font-semibold uppercase text-muted-foreground">
            Principais funcionalidades
          </h3>

          <ul className="space-y-3">
            <li className="flex items-start">
              <Check className="mr-2 h-5 w-5 flex-shrink-0 text-purple-500" />
              <span>
                <span className="font-medium">Cardápio digital responsivo</span>{' '}
                - Funciona em qualquer dispositivo
              </span>
            </li>
            <li className="flex items-start">
              <Check className="mr-2 h-5 w-5 flex-shrink-0 text-purple-500" />
              <span>
                <span className="font-medium">Link amigável</span> - Fácil de
                compartilhar com seus clientes
              </span>
            </li>
            <li className="flex items-start">
              <Check className="mr-2 h-5 w-5 flex-shrink-0 text-purple-500" />
              <span>
                <span className="font-medium">Notificações em tempo real</span>{' '}
                - Seja alertado sobre novos pedidos
              </span>
            </li>
            <li className="flex items-start">
              <Check className="mr-2 h-5 w-5 flex-shrink-0 text-purple-500" />
              <span>
                <span className="font-medium">Análises e gráficos</span> -
                Visualize seus dados em um painel intuitivo
              </span>
            </li>
            <li className="flex items-start">
              <Check className="mr-2 h-5 w-5 flex-shrink-0 text-purple-500" />
              <span>
                <span className="font-medium">Impressão de pedidos</span> -
                Agilize o processo na cozinha
              </span>
            </li>
          </ul>
        </div>

        <div className="flex-1 text-white h-full space-y-4">
          <h3 className="text-sm font-semibold uppercase text-muted-foreground">
            Recursos ilimitados
          </h3>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center rounded-md bg-zinc-800 p-3">
                <ShoppingCart className="mr-2 h-5 w-5 text-purple-500" />
                <span className="text-sm">Pedidos ilimitados</span>
              </div>
              <div className="flex items-center rounded-md bg-zinc-800 p-3">
                <Users className="mr-2 h-5 w-5 text-purple-500" />
                <span className="text-sm">Produtos ilimitados</span>
              </div>
              <div className="flex items-center rounded-md bg-zinc-800 p-3">
                <ImageIcon className="mr-2 h-5 w-5 text-purple-500" />
                <span className="text-sm">Fotos nos produtos</span>
              </div>
              <div className="flex items-center rounded-md bg-zinc-800 p-3">
                <FileStack className="mr-2 h-5 w-5 text-purple-500" />
                <span className="text-sm">Contato e Sobre</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col items-center rounded-md bg-zinc-800 p-3">
                <Smartphone className="mb-1 h-5 w-5 text-purple-500" />
                <span className="text-xs">Responsivo</span>
              </div>
              <div className="flex flex-col items-center rounded-md bg-zinc-800 p-3">
                <LayoutGrid className="mb-1 h-5 w-5 text-purple-500" />
                <span className="text-xs">Painel Admin</span>
              </div>
              <div className="flex flex-col items-center rounded-md bg-zinc-800 p-3">
                <BarChart3 className="mb-1 h-5 w-5 text-purple-500" />
                <span className="text-xs">Análises</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col space-y-2 p-6 pt-0">
        <Link href="/pagamento" className="w-full">
          <Button variant="purple" className="w-full py-6">
            Assinar Agora
          </Button>
        </Link>
        <p className="text-xs text-gray-400">
          Preço promocional por tempo limitado. Cancele a qualquer momento.
        </p>
      </CardFooter>
    </Card>
  )
}
