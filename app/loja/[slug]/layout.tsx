'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

import { useStore } from '@/hooks/use-store'
import { useOpenStore } from '@/hooks/use-store'

import { Header } from '@/app/loja/_components/header'

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
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

  return (
    <section>
      <Header />
      {children}
    </section>
  )
}
