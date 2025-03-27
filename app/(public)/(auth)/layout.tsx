'use client'

import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'

import { useCurrentUser } from '@/features/auth/hooks/use-current-user'

import { Skeleton } from '@/components/ui/skeleton'
import { Container } from '@/components/container'

const Message = () => {
  return (
    <div className="lg:flex hidden flex-col gap-4">
      <h1 className="text-2xl font-semibold">Bem vindo</h1>
      <p className="text-sm text-muted-foreground">
        Nossa plataforma te ajuda com a administração do seu delivery, seja na
        gestão dos seus produtos, pedidos e clientes.
      </p>
      <p className="text-sm text-muted-foreground">
        Tudo em um só lugar, e na pão da sua mão, conte ainda com gráfico de
        desempenho do seus pedidos, além de uma análise rápida de seu
        faturamento.
      </p>
      <p className="text-sm font-medium">Vamos começar.</p>
    </div>
  )
}

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

// TODO: Change message (2 Feat)
{
  /* <p className="text-sm text-muted-foreground">
          Nossa plataforma revoluciona as vendas pelo WhatsApp, automatizando o
          cadastro de produtos e o atendimento ao cliente.
        </p>
        <p className="text-sm text-muted-foreground">
          Com um banco de dados sempre atualizado, seu assistente virtual
          responderá instantaneamente às consultas dos clientes, agilizando
          vendas e maximizando eficiência.
        </p> */
}
