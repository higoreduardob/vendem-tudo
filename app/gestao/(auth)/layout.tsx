'use client'

import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'

import { useCurrentUser } from '@/features/auth/hooks/use-current-user'

import { Container } from '@/components/container'
import { Skeleton } from '@/components/ui/skeleton'

const Message = () => {
  return (
    <div className="lg:flex hidden flex-col gap-4">
      <h1 className="text-2xl font-semibold">Bem vindo</h1>
      <p className="text-sm text-muted-foreground">
        Faça login para acessar o painel de gestão da plataforma!
      </p>
    </div>
  )
}

function AuthLayoutComponent({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user, status } = useCurrentUser()

  useEffect(() => {
    if (status === 'authenticated' && user) {
      router.push('/gestao')
    }
  }, [user, status, router])

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
