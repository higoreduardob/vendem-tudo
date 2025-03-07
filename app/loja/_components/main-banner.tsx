'use client'

import Image from 'next/image'
import { Search } from 'lucide-react'

import { useOpenStore } from '@/hooks/use-store'
import { useGetStoreCategories } from '@/features/foods/categories/api/use-get-categories'

import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export function MainBanner() {
  const { store } = useOpenStore()
  const categoriesQuery = useGetStoreCategories(store?.id)
  const categories = categoriesQuery.data || []

  if (!store) {
    return null
  }

  if (categoriesQuery.isLoading) {
    return <>Skeleton</>
  }

  return (
    <div className="relative h-[500px] w-full overflow-hidden md:h-[800px]">
      <Image
        src="/home-store-slug-desktop-bg.webp"
        alt="Banner promocional"
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent">
        <div className="container mx-auto flex h-full flex-col justify-center px-4 text-white">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Faça sua busca
              </h1>
              <p className="text-lg">
                Entregamos tudo o que precisa na porta da sua casa, ou se
                preferir retire na loja
              </p>

              <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mt-8">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="O que você está procurando?"
                    className="w-full pl-12 h-12 text-base placeholder:text-white"
                  />
                </div>
                <Button variant="red" className="h-12 px-8 font-medium">
                  Pesquisar
                </Button>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 py-8 z-10">
            <div className="max-w-2xl mx-auto">
              <nav className="flex flex-wrap justify-center gap-2">
                {categories.map((category, index) => (
                  <Badge
                    key={index}
                    className="p-2 text-muted-foreground font-normal rounded-full bg-white border border-gray-200 text-black hover:border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    {category.name}
                  </Badge>
                ))}
                {/* {[
                  'Lanches',
                  'Bebidas',
                  'Combos',
                  'Promocionais',
                  'Doces',
                  'Porções',
                  'Fritas',
                  'Peixes',
                  'Camarões',
                  'Sushi',
                  'Carnes',
                  'Cerveja',
                ].map((category) => (
                  <Badge
                    key={category}
                    className="p-2 text-muted-foreground font-normal rounded-full bg-white border border-gray-200 text-black hover:border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    {category}
                  </Badge>
                ))} */}
              </nav>
            </div>
          </div>
        </div>

        {/* <div className="container mx-auto flex h-full flex-col justify-center px-4 text-white">
          <h1 className="max-w-md text-3xl font-bold md:text-4xl lg:text-5xl">
            Promoção Especial de Lançamento
          </h1>
          <p className="mt-2 max-w-md text-lg md:text-xl">
            Peça agora e ganhe 20% de desconto no seu primeiro pedido
          </p>
          <Button variant="destructive" size="lg" className="mt-4 w-fit">
            Pedir Agora
          </Button>
        </div> */}
      </div>
    </div>
  )
}
