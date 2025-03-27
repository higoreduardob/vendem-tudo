import { Title } from '@/app/(public)/_components/title'
import { Plans } from '@/app/(public)/_components/plans'
import { Container } from '@/components/container'

export default function PlansPage() {
  return (
    <Container className="space-y-10 min-h-[calc(100vh-117px)] flex-col flex justify-center py-10">
      <Title
        title="Nunca foi tão fácil vender online"
        description="Garantia total de satisfação! Teste grátis por 7 dias."
      />

      <Plans />
    </Container>
  )
}
