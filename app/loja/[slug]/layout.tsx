'use client'

import { useEffect } from 'react'
import { useParams, useRouter, usePathname } from 'next/navigation'

import { useStore } from '@/hooks/use-store'
import { useOpenStore } from '@/hooks/use-store'

import { Header } from '@/app/loja/_components/header'
import { DialogProvider } from '../_providers/dialog-provider'
import { SheetProvider } from '../_providers/sheet-provider'
// import { Footer } from '../_components/footer'

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const params = useParams() as { slug?: string }
  useStore(params.slug)

  // const router = useRouter()
  const { store } = useOpenStore()

  // useEffect(() => {
  //   if (!store) {
  //     router.push('/')
  //   }
  // }, [store, router])

  // TODO: Check if store is available to sales (categories/products/payment/delivery e etc..)

  if (!store) {
    return null
  }

  const isAccountPage = pathname.includes('/conta')

  return (
    <>
      <DialogProvider />
      <SheetProvider />
      <section>
        {!isAccountPage && <Header />}
        {children}
        {/* {!isAccountPage && <Footer />} */}
      </section>
    </>
  )
}
