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

  return (
    <div className="min-h-screen">
      <MainBanner />
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* <GridProducts title="Destaques" products={foods} /> */}
          <div className="space-y-4">
            <Title title="Categorias" />
            <Carousel />
          </div>
          <GridProducts title="Cardápio" products={foods}>
            <CategoryMenu />
          </GridProducts>
        </div>
      </div>
    </div>
  )
}
