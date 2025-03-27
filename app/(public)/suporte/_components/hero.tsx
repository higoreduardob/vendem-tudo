import { Title } from '@/app/(public)/_components/title'
import { Container } from '@/components/container'

export const Hero = () => {
  return (
    <Container className="py-10 text-center relative space-y-10">
      {/* Hero Section */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute h-2 w-2 bg-purple-500 rounded-full top-10 left-1/4 animate-pulse"></div>
        <div className="absolute h-2 w-2 bg-purple-500 rounded-full top-20 right-1/3 animate-pulse delay-300"></div>
        <div className="absolute h-2 w-2 bg-purple-500 rounded-full bottom-10 left-1/3 animate-pulse delay-700"></div>
        <div className="absolute h-2 w-2 bg-purple-500 rounded-full bottom-20 right-1/4 animate-pulse delay-500"></div>
      </div>

      <Title
        title="Central de Suporte"
        description="Estamos aqui para ajudar você a aproveitar ao máximo nossa plataforma de delivery"
      />
    </Container>
  )
}
