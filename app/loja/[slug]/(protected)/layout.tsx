'use client'

import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { useOpenStore } from '@/hooks/use-store'
import { useCurrentUser } from '@/features/auth/hooks/use-current-user'

import { Skeleton } from '@/components/ui/skeleton'

function ProtectedLayoutComponent({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { store } = useOpenStore()
  const { user, status } = useCurrentUser()

  useEffect(() => {
    if (!user) {
      router.push(`/loja/${store?.slug}/entrar`)
    }
  }, [user, status, router, store])

  if (status === 'loading') {
    return (
      <section className="grid min-h-svh">
        <Skeleton className="h-full w-full" />
      </section>
    )
  }

  if (!user) {
    return (
      <section className="grid min-h-svh">
        <Skeleton className="h-full w-full" />
      </section>
    )
  }

  return <>{children}</>
}

const ProtectedLayout = dynamic(
  () => Promise.resolve(ProtectedLayoutComponent),
  {
    ssr: false,
  }
)

export default ProtectedLayout
