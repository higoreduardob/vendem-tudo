'use client'

import { useOpenStore } from '@/hooks/use-store'
import { useGetStoreFoods } from '@/features/foods/api/use-get-foods'

import { Container } from '@/components/container'
import { MainBanner } from '@/app/loja/_components/main-banner'
import { CategoryMenu } from '@/app/loja/_components/category-menu'
import { GridProducts } from '@/features/foods/components/grid-products'

export default function StorePage() {
  const { store } = useOpenStore()
  const foodsQuery = useGetStoreFoods(store?.id)
  const foods = foodsQuery.data || []

  return (
    <div className="space-y-8">
      <MainBanner />
      <Container className="space-y-8">
        <GridProducts title="Cardápio" products={foods}>
          <CategoryMenu />
        </GridProducts>
      </Container>
    </div>
  )
}
