import Link from 'next/link'
import Image from 'next/image'

import { Heart, ShoppingBag } from 'lucide-react'

import { useOpenStore } from '@/hooks/use-store'
import { useGetStoreCategories } from '@/features/foods/categories/api/use-get-categories'

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { Button } from '@/components/ui/button'

export const Header = () => {
  const { store } = useOpenStore()
  const categoriesQuery = useGetStoreCategories(store?.id)
  const categories = categoriesQuery.data || []

  const HEADER_NAV_MAIN = [
    { title: 'Início', url: '' },
    { title: 'Sobre', url: 'sobre' },
    {
      title: 'Categorias',
      items: categories.map((category) => ({
        title: category.name,
        // count: category._count.foods,
      })),
    },
    { title: 'Contato', url: 'sobre' },
  ]

  if (categoriesQuery.isLoading) {
    return <>Skeleton</>
  }

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/70 backdrop-blur-md z-50 border-b border-red-500/50 w-full bg-none transition-transform duration-300 py-2">
      <div className="flex items-center justify-between px-4 text-black">
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/logo.svg" alt="Vendem Tudo" width={32} height={32} />
        </Link>

        <NavigationMenu className="hidden md:flex mx-6">
          <NavigationMenuList>
            {HEADER_NAV_MAIN?.length > 0 &&
              HEADER_NAV_MAIN.map((item, index) => (
                <NavigationMenuItem key={index}>
                  {item.items ? (
                    <>
                      <Button asChild variant="ghost">
                        <NavigationMenuTrigger>
                          {item.title}
                        </NavigationMenuTrigger>
                      </Button>
                      <NavigationMenuContent>
                        {/* TODO: Fix center style */}
                        <div>
                          {item.items.map((value, key) => (
                            <Button key={key} variant="ghost">
                              {value.title}
                              {/* <span className="text-sm opacity-50">
                                {value.count}
                              </span> */}
                            </Button>
                          ))}
                        </div>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <Link href={item.url}>
                      <Button variant="ghost">
                        <span>{item.title}</span>
                      </Button>
                    </Link>
                  )}
                </NavigationMenuItem>
              ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-2 text-black">
          <Link
            href="favoritos"
            className="relative flex items-center justify-center w-12 h-12 rounded-full cursor-pointer hover:bg-black/[0.05] hover:text-white"
          >
            <Heart className="text-[24px]" />
            <span className="absolute top-0 left-6 flex items-center justify-center h-[20px] min-w-[20px] text-[12px] text-white bg-red-600 rounded-full">
              5
            </span>
          </Link>

          <Link
            href="carrinho"
            className="relative flex items-center justify-center w-12 h-12 rounded-full cursor-pointer hover:bg-black/[0.05] hover:text-white"
          >
            <ShoppingBag className="text-[24px]" />
            <span className="absolute top-0 left-6 flex items-center justify-center h-[20px] min-w-[20px] text-[12px] text-white bg-red-600 rounded-full">
              3{/* {items?.length ?? 0} */}
            </span>
          </Link>
        </div>
      </div>
    </header>
  )
}
