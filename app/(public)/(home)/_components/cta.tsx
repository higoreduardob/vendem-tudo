import { Title } from '@/app/(public)/_components/title'
import { Plans } from '@/app/(public)/_components/plans'

export const Cta = () => {
  return (
    <div className="space-y-20">
      <div className="container mx-auto space-y-10 p-4 py-10">
        <Title
          title="Nunca foi tão fácil vender online"
          description="Garantia total de satisfação! Teste grátis por 7 dias."
        />

        <Plans />
      </div>
    </div>
  )
}
