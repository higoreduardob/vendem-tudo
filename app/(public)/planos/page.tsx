import {
  Check,
  Smartphone,
  LayoutGrid,
  BarChart3,
  ShoppingCart,
  Image,
  Users,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'

export default function PlansPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-117px)] bg-black/[0.96]">
      <div className="mx-auto max-w-6xl text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-white">
            Nunca foi tão fácil vender online
          </h1>
          <p className="text-lg text-gray-400">
            Garantia total de satisfação! Teste grátis por 7 dias.
          </p>
        </div>

        <Card className="mx-auto max-w-md overflow-hidden rounded-xl border-0 bg-zinc-900 text-white shadow-lg">
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

          <CardContent className="p-6 space-y-6">
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase text-gray-400">
                Principais funcionalidades
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 flex-shrink-0 text-purple-500" />
                  <span>
                    <span className="font-medium">
                      Cardápio digital responsivo
                    </span>{' '}
                    - Funciona em qualquer dispositivo
                  </span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 flex-shrink-0 text-purple-500" />
                  <span>
                    <span className="font-medium">Link amigável</span> - Fácil
                    de compartilhar com seus clientes
                  </span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 flex-shrink-0 text-purple-500" />
                  <span>
                    <span className="font-medium">
                      Notificações em tempo real
                    </span>{' '}
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

            <div className="space-y-3">
              <h3 className="mb-4 text-sm font-semibold uppercase text-gray-400">
                Recursos ilimitados
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center rounded-md bg-zinc-800 p-3">
                  <ShoppingCart className="mr-2 h-5 w-5 text-blue-500" />
                  <span className="text-sm">Pedidos ilimitados</span>
                </div>
                <div className="flex items-center rounded-md bg-zinc-800 p-3">
                  <Users className="mr-2 h-5 w-5 text-blue-500" />
                  <span className="text-sm">Produtos ilimitados</span>
                </div>
                <div className="flex items-center rounded-md bg-zinc-800 p-3">
                  <Image className="mr-2 h-5 w-5 text-blue-500" />
                  <span className="text-sm">Fotos nos produtos</span>
                </div>
                <div className="flex items-center rounded-md bg-zinc-800 p-3">
                  <Users className="mr-2 h-5 w-5 text-blue-500" />
                  <span className="text-sm">Contato e Sobre</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col items-center rounded-md bg-zinc-800 p-3">
                  <Smartphone className="mb-1 h-5 w-5 text-blue-500" />
                  <span className="text-xs">Responsivo</span>
                </div>
                <div className="flex flex-col items-center rounded-md bg-zinc-800 p-3">
                  <LayoutGrid className="mb-1 h-5 w-5 text-blue-500" />
                  <span className="text-xs">Painel Admin</span>
                </div>
                <div className="flex flex-col items-center rounded-md bg-zinc-800 p-3">
                  <BarChart3 className="mb-1 h-5 w-5 text-blue-500" />
                  <span className="text-xs">Análises</span>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-2 p-6 pt-0">
            <Button variant="purple" className="w-full py-6">
              Assinar Agora
            </Button>
            <p className="text-xs text-gray-400">
              Preço promocional por tempo limitado. Cancele a qualquer momento.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
