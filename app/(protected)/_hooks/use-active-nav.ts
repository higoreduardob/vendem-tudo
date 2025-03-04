import { usePathname } from 'next/navigation'

import { NavMainProps } from '@/app/(protected)/_components/nav-main'

export const useActiveNav = (navMain: NavMainProps) => {
  const pathname = usePathname()

  const setActiveState = (
    items: NavMainProps['navMain']
  ): NavMainProps['navMain'] => {
    return items.map((item) => {
      const isActive =
        pathname === item.url ||
        (item.items &&
          item.items.some((child) => pathname.startsWith(child.url)))

      return {
        ...item,
        isActive,
        items: item.items ? setActiveState(item.items) : undefined,
      }
    })
  }

  return setActiveState(navMain.navMain)
}
