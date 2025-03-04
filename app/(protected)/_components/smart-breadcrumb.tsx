'use client'

import React from 'react'
import Link from 'next/link'
import { Home } from 'lucide-react'
import { usePathname } from 'next/navigation'

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { NavMainProps } from '@/app/(protected)/_components/nav-main'

export const SmartBreadcrumb = ({ navMain }: NavMainProps) => {
  const pathname = usePathname()
  const currentPath = pathname.split('/').filter(Boolean)

  const findBreadcrumb = (
    items: NavMainProps['navMain'],
    path: string[],
    breadcrumb: { title: string; url: string }[] = []
  ): { title: string; url: string }[] | null => {
    for (const item of items) {
      const itemPath = item.url.split('/').filter(Boolean)
      const newBreadcrumb = [
        ...breadcrumb,
        { title: item.title, url: item.url },
      ]

      if (itemPath.join('/') === path.slice(0, itemPath.length).join('/')) {
        if (itemPath.length === path.length) {
          return newBreadcrumb
        }
        if (item.items) {
          const found = findBreadcrumb(item.items, path, newBreadcrumb)
          if (found) return found
        }
      }
    }
    return null
  }

  const breadcrumbPath = findBreadcrumb(navMain, currentPath) || []

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <Link href="/plataforma" passHref legacyBehavior>
            <BreadcrumbLink className="flex items-center text-gray-600 font-medium">
              <Home size={16} className="mr-1" />
              <span className="hidden md:inline">Plataforma</span>
            </BreadcrumbLink>
          </Link>
        </BreadcrumbItem>

        {breadcrumbPath.map((item, index) => (
          <React.Fragment key={`breadcrumb-${index}`}>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              {index === breadcrumbPath.length - 1 ? (
                <BreadcrumbPage className="font-medium">
                  {item.title}
                </BreadcrumbPage>
              ) : (
                <Link href={item.url} passHref legacyBehavior>
                  <BreadcrumbLink className="text-gray-600">
                    {item.title}
                  </BreadcrumbLink>
                </Link>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
