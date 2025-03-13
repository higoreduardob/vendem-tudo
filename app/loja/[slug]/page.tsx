'use client'

import { useOpenStore } from '@/hooks/use-store'
import { useGetStoreFoods } from '@/features/foods/api/use-get-foods'

import { Title } from '@/app/loja/_components/title'
import { GridProducts } from '@/features/foods/components/grid-products'

import { Carousel } from '../_components/carousel'
import { MainBanner } from '../_components/main-banner'
import { CategoryMenu } from '../_components/category-menu'

export default function StorePage() {
  const { store } = useOpenStore()
  const foodsQuery = useGetStoreFoods(store?.id)
  const foods = foodsQuery.data || []
console.log(foods)
  return (
    <div className="min-h-screen">
      <MainBanner />
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <GridProducts title="Destaques" products={foods} />
          <div className="space-y-4">
            <Title title="Categorias" />
            <Carousel />
          </div>
          <GridProducts title="Cardápio" products={foods}>
            <CategoryMenu variant="dropdown" />
          </GridProducts>
        </div>
      </div>
    </div>
  )
}

{
  /* <section className="relative w-full min-h-[80vh] flex flex-col justify-center">
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
            </nav>
          </div>
        </div>
      </section> */
}

{
  /* <div className="grid grid-cols-1 gap-6 md:grid-cols-[240px_1fr]">
          <CategoryMenu className="hidden md:block" />
        </div> */
}
