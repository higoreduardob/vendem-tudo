'use client'

import { useEffect } from 'react'
import { signOut } from 'next-auth/react'
import { useParams, useRouter, usePathname } from 'next/navigation'

import { useStore } from '@/hooks/use-store'
import { useOpenStore } from '@/hooks/use-store'
import { useCurrentUser } from '@/features/auth/hooks/use-current-user'

import { DialogProvider } from '@/app/loja/_providers/dialog-provider'
import { SheetProvider } from '@/app/loja/_providers/sheet-provider'

import { Header } from '@/app/loja/_components/header'
import { Footer } from '@/app/loja/_components/footer'

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams() as { slug?: string }
  const { user, status } = useCurrentUser()
  useStore(params.slug)

  const { store } = useOpenStore()
  const isMaintenancePage = pathname.includes('/manutencao')
  const isAccountPage = pathname.includes('/conta')

  useEffect(() => {
    if (store && !store.enabled && !isMaintenancePage) {
      router.push(`/loja/${store.slug}/manutencao`)
    }
  }, [router, store, isMaintenancePage, pathname])

  useEffect(() => {
    if (user) {
      const allowedRoles = ['CUSTOMER']
      if (user.role && !allowedRoles.includes(user.role)) {
        signOut()
      }
    }
  }, [user, status])

  if (!store) {
    return null
  }

  if (!store.enabled && !isMaintenancePage) {
    return null
  }

  return (
    <>
      <DialogProvider />
      <SheetProvider />
      <section>
        {!isAccountPage && !isMaintenancePage && <Header />}
        {children}
        {!isAccountPage && !isMaintenancePage && <Footer />}
      </section>
    </>
  )
}
