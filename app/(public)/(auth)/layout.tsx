'use client'

import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'

import { useCurrentUser } from '@/features/auth/hooks/use-current-user'

import { Skeleton } from '@/components/ui/skeleton'

function AuthLayoutComponent({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user, status } = useCurrentUser()

  useEffect(() => {
    if (status === 'authenticated' && user) {
      router.push('/plataforma')
    }
  }, [user, status, router])

  if (status === 'loading') {
    return (
      <section className="flex min-h-[calc(100vh-117px)] justify-center items-center max-w-6xl mx-auto">
        <div className="flex-1 flex flex-col gap-4 p-4">
          <Skeleton className="h-full w-full" />
        </div>
        <div className="flex-1 md:flex hidden items-center justify-center p-6 lg:justify-end">
          <div className="max-w-md space-y-3">
            <h1 className="text-2xl font-semibold">Bem vindo</h1>
            <p className="text-sm text-muted-foreground">
              Nossa plataforma revoluciona as vendas pelo WhatsApp,
              automatizando o cadastro de produtos e o atendimento ao cliente.
            </p>
            <p className="text-sm text-muted-foreground">
              Com um banco de dados sempre atualizado, seu assistente virtual
              responderá instantaneamente às consultas dos clientes, agilizando
              vendas e maximizando eficiência.
            </p>
            <p className="text-sm font-medium">Vamos começar.</p>
          </div>
        </div>
      </section>
    )
  }

  if (status === 'authenticated' && user) {
    return null
  }

  return (
    <section className="flex min-h-[calc(100vh-117px)] justify-center items-center max-w-6xl mx-auto gap-2">
      <div className="flex-1 flex flex-col gap-4 p-4">{children}</div>
      <div className="flex-1 md:flex hidden items-center justify-center">
        <div className="max-w-md space-y-3">
          <h1 className="text-2xl font-semibold">Bem vindo</h1>
          <p className="text-sm text-muted-foreground">
            Nossa plataforma revoluciona as vendas pelo WhatsApp, automatizando
            o cadastro de produtos e o atendimento ao cliente.
          </p>
          <p className="text-sm text-muted-foreground">
            Com um banco de dados sempre atualizado, seu assistente virtual
            responderá instantaneamente às consultas dos clientes, agilizando
            vendas e maximizando eficiência.
          </p>
          <p className="text-sm font-medium">Vamos começar.</p>
        </div>
      </div>
    </section>
  )
}

const AuthLayout = dynamic(() => Promise.resolve(AuthLayoutComponent), {
  ssr: false,
})

export default AuthLayout
