import { Title } from '@/app/(public)/_components/title'
import { Plans } from '@/app/(public)/_components/plans'
import { Container } from '@/components/container'

export const Cta = () => {
  return (
    <Container className="space-y-10 py-10" id="cadastrar">
      <Title
        title="Nunca foi tão fácil vender online"
        description="Garantia total de satisfação! Teste grátis por 7 dias."
      />

      <Plans />
    </Container>
  )
}
