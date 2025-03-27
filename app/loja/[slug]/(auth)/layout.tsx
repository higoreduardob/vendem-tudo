'use client'

import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'

import { useOpenStore } from '@/hooks/use-store'
import { useCurrentUser } from '@/features/auth/hooks/use-current-user'

import { Container } from '@/components/container'
import { Skeleton } from '@/components/ui/skeleton'

const Message = () => {
  return (
    <div className="lg:flex hidden flex-col gap-4">
      <h1 className="text-2xl font-semibold">Bem vindo</h1>
      <p className="text-sm text-muted-foreground">
        Faça login para pedir seus pratos favoritos com apenas alguns cliques.
        Entrega ágil, comida incrível e a melhor experiência para você!
      </p>
      <p className="text-sm font-medium">Bateu a fome? Vamos começar!</p>
    </div>
  )
}

function AuthLayoutComponent({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { store } = useOpenStore()
  const { user, status } = useCurrentUser()

  if (!store) return null

  useEffect(() => {
    if (status === 'authenticated' && user) {
      router.push(`/loja/${store?.slug}/conta`)
    }
  }, [user, status, router, store])

  if (status === 'loading') {
    return (
      <Container className="min-h-[calc(100vh-117px)] grid lg:grid-cols-2 grid-cols-1 gap-4 justify-center items-center">
        <Skeleton className="h-[250px] w-full flex-1" />
        <Message />
      </Container>
    )
  }

  if (status === 'authenticated' && user) {
    return null
  }

  return (
    <Container className="min-h-[calc(100vh-117px)] grid lg:grid-cols-2 grid-cols-1 gap-4 justify-center items-center">
      <div className="flex flex-col gap-4">{children}</div>
      <Message />
    </Container>
  )
}

const AuthLayout = dynamic(() => Promise.resolve(AuthLayoutComponent), {
  ssr: false,
})

export default AuthLayout
