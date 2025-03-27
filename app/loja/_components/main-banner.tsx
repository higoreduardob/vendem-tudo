'use client'

import Image from 'next/image'
import { Search } from 'lucide-react'
import { useState, useEffect } from 'react'

import { useOpenStore } from '@/hooks/use-store'
import { useSearchFood } from '@/features/foods/hooks/use-filter-food'
import { useGetStoreCategories } from '@/features/foods/categories/api/use-get-categories'

import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export function MainBanner() {
  const { store } = useOpenStore()
  const { categoryId, search, onChange, clear } = useSearchFood()
  const categoriesQuery = useGetStoreCategories(store?.id)
  const categories = categoriesQuery.data || []

  const [tempSearch, setTempSearch] = useState(search || '')

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (tempSearch !== search) {
        onChange(categoryId, tempSearch)
      }
    }, 600)

    return () => clearTimeout(timeout)
  }, [tempSearch, search, categoryId, onChange])

  if (!store) {
    return null
  }

  if (categoriesQuery.isLoading) {
    return <>Skeleton</>
  }

  return (
    <div className="relative h-[750px] w-full overflow-hidden">
      <Image
        src="/home-store-slug-desktop-bg.webp"
        alt="Banner promocional"
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent">
        <div className="container mx-auto flex h-full flex-col justify-center px-4 text-gray-700">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Faça sua busca
              </h1>
              <p className="text-lg">
                Entregamos tudo o que precisa na porta da sua casa, ou se
                preferir retire na loja
              </p>

              <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mt-8">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white" />
                  <Input
                    value={tempSearch}
                    type="text"
                    placeholder="O que procura?"
                    className="w-full pl-12 h-12 text-base placeholder:text-white border-white"
                    onChange={({ target: { value } }) => setTempSearch(value)}
                  />
                </div>
                <Button
                  variant="destructive"
                  className="h-12 px-8 font-medium"
                  onClick={() => {
                    setTempSearch('')
                    clear()
                  }}
                >
                  Limpar
                </Button>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 py-8 z-10">
            <div className="max-w-2xl mx-auto">
              <nav className="flex flex-wrap justify-center gap-2">
                {!!categories.length ? (
                  categories.map((category, index) => (
                    <Badge
                      key={index}
                      className="p-2 text-muted-foreground font-normal rounded-full bg-white border border-gray-200 text-black hover:border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => onChange(category.id, search)}
                    >
                      {category.name}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm">Nenhuma categoria encontrada</span>
                )}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
