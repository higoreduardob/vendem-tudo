import Link from 'next/link'
import { ShoppingBag, User } from 'lucide-react'

import { useOpenStore } from '@/hooks/use-store'
import { useOpenAbout } from '@/app/loja/_components/about-store'
import { useGetStoreCategories } from '@/features/foods/categories/api/use-get-categories'

import { useCartStore } from '@/features/foods/orders/schema'

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { Button } from '@/components/ui/button'
import { useOpenOrder } from '@/features/foods/orders/components/form-order'

export const Header = () => {
  const { cart } = useCartStore()
  const { store } = useOpenStore()
  const { onOpen: onOpenAbout } = useOpenAbout()
  const { onOpen: onOpenOrder } = useOpenOrder()

  const categoriesQuery = useGetStoreCategories(store?.id)
  const categories = categoriesQuery.data || []

  const HEADER_NAV_MAIN = [
    {
      title: 'Categorias',
      onClick: () => {},
      items: categories.map((category) => ({
        title: category.name,
        count: category._count.foods,
      })),
    },
    { title: 'Sobre', onClick: () => onOpenAbout() },
  ]

  if (categoriesQuery.isLoading) {
    return <>Skeleton</>
  }

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/70 border-b backdrop-blur-md z-50 w-full bg-none transition-transform duration-300 py-2">
      <div className="flex items-center justify-between px-4 text-black">
        <NavigationMenu className="hidden md:flex mx-6">
          <NavigationMenuList>
            {HEADER_NAV_MAIN?.length > 0 &&
              HEADER_NAV_MAIN.map((item, index) => (
                <NavigationMenuItem key={index}>
                  {item.items ? (
                    <>
                      <NavigationMenuTrigger className="bg-transparent hover:bg-accent hover:text-accent-foreground">
                        {item.title}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="p-1">
                          {item.items.map((value, key) => (
                            <Button
                              key={key}
                              variant="ghost"
                              className="w-full flex items-center justify-between"
                              onClick={item.onClick}
                            >
                              {value.title}
                              <span className="text-sm opacity-50">
                                {value.count}
                              </span>
                            </Button>
                          ))}
                        </div>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <Button variant="ghost" onClick={item.onClick}>
                      <span>{item.title}</span>
                    </Button>
                  )}
                </NavigationMenuItem>
              ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-2 text-black">
          <Button
            variant="ghost"
            className="relative flex items-center justify-center w-10 h-10 rounded-full cursor-pointer hover:bg-black/[0.05]"
            onClick={onOpenOrder}
          >
            <ShoppingBag className="h-[1.2rem] w-[1.2rem]" />
            <span className="absolute top-0 left-6 flex items-center justify-center h-[16px] min-w-[16px] text-[12px] text-white bg-red-600 rounded-full">
              {cart?.length ?? 0}
            </span>
          </Button>

          {/* <Button
            variant="ghost"
            className="relative flex items-center justify-center w-10 h-10 rounded-full cursor-pointer hover:bg-black/[0.05]"
          >
            <Heart className="h-[1.2rem] w-[1.2rem]" />
            <span className="absolute top-0 left-6 flex items-center justify-center h-[16px] min-w-[16px] text-[12px] text-white bg-red-600 rounded-full">
              5
            </span>
          </Button> */}

          <Link
            href={`/loja/${store!.slug}/entrar`}
            className="relative flex items-center justify-center w-10 h-10 rounded-full cursor-pointer hover:bg-black/[0.05]"
          >
            <User className="h-[1.2rem] w-[1.2rem]" />
          </Link>
        </div>
      </div>
    </header>
  )
}
