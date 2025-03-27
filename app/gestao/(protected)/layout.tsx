'use client'

import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { useCurrentUser } from '@/features/auth/hooks/use-current-user'

import { Skeleton } from '@/components/ui/skeleton'
import { DialogProvider } from '@/app/gestao/_providers/dialog-provider'

function ProtectedLayoutComponent({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user, status } = useCurrentUser()

  useEffect(() => {
    if (!user) {
      router.push('/gestao/entrar')
    }
  }, [user, status, router])

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

  return (
    <>
      <DialogProvider />
      {children}
    </>
  )
}

const ProtectedLayout = dynamic(
  () => Promise.resolve(ProtectedLayoutComponent),
  {
    ssr: false,
  }
)

export default ProtectedLayout
