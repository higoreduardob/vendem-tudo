'use client'

import Image from 'next/image'
import { Search } from 'lucide-react'

import { useOpenStore } from '@/hooks/use-store'
import { useGetStoreCategories } from '@/features/foods/categories/api/use-get-categories'

import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export default function StorePage() {
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
    <div className="min-h-screen">
      <section className="relative w-full min-h-[80vh] flex flex-col justify-center">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/home-store-slug-desktop-bg.webp"
            alt="Background with food items"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Faça seu pedido em {store.name}
            </h1>
            <p className="text-lg text-gray-600">
              Entregamos tudo o que precisa na porta da sua casa, ou se preferir
              retire na loja
            </p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mt-8">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="O que você está procurando?"
                  className="w-full pl-12 h-12 text-base border-gray-200"
                />
              </div>
              <Button className="h-12 px-8 bg-red-500 hover:bg-red-600 text-white font-medium">
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
                  className="p-2 text-muted-foreground font-normal rounded-full bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
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
                  className="p-2 text-muted-foreground font-normal rounded-full bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  {category}
                </Badge>
              ))} */}
            </nav>
          </div>
        </div>
      </section>
    </div>
  )
}
