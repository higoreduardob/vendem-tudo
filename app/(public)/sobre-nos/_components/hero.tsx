import {
  BarChart3,
  CreditCard,
  LucideProps,
  Smartphone,
  Store,
  Truck,
  Users,
} from 'lucide-react'

import { Title } from '@/app/(public)/_components/title'
import { Container } from '@/components/container'

type DetailProps = {
  title: string
  description: string
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
  >
}

const Detail = ({ title, description, icon: Icon }: DetailProps) => {
  return (
    <div className="bg-card rounded-lg p-6 shadow-sm border flex gap-2">
      <div className="flex items-center justify-center p-3 h-fit bg-purple-950/80 text-white rounded-lg">
        <Icon className="h-6 w-6" />
      </div>
      <div className="text-start">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

export const Hero = () => {
  const details = {
    about: {
      title: {
        head: 'Por que escolher nossa plataforma?',
        description:
          'Desenvolvemos uma solução pensada especificamente para as necessidades dos pequenos negócios locais.',
      },
      details: [
        {
          title: 'Fácil de usar',
          description:
            'Interface intuitiva que não exige conhecimentos técnicos, permitindo que você gerencie seu negócio sem complicações.',
          icon: Smartphone,
        },
        {
          title: 'Múltiplos pagamentos',
          description:
            'Aceite diversos métodos de pagamento como PIX, cartões de crédito/débito, dinheiro e vale-refeição.',
          icon: CreditCard,
        },
        {
          title: 'Gestão de entregas',
          description:
            'Configure taxas por bairro, tempos de entrega e valores mínimos para pedidos, ou ofereça a opção de retirada no local.',
          icon: Truck,
        },
        {
          title: 'Loja personalizada',
          description:
            'Crie sua loja online com sua identidade visual, horários de funcionamento e informações específicas do seu negócio.',
          icon: Store,
        },
        {
          title: 'Análises detalhadas',
          description:
            'Acompanhe o desempenho do seu negócio com relatórios de vendas, produtos mais populares e avaliações de clientes.',
          icon: BarChart3,
        },
        {
          title: 'Gestão de equipe',
          description:
            'Adicione funcionários com diferentes níveis de acesso para gerenciar pedidos, cardápios e outras funções.',
          icon: Users,
        },
      ],
    },
  }

  return (
    <Container className="space-y-10 py-10 text-center relative">
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute h-2 w-2 bg-purple-500 rounded-full top-10 left-1/4 animate-pulse"></div>
        <div className="absolute h-2 w-2 bg-purple-500 rounded-full top-20 right-1/3 animate-pulse delay-300"></div>
        <div className="absolute h-2 w-2 bg-purple-500 rounded-full bottom-10 left-1/3 animate-pulse delay-700"></div>
        <div className="absolute h-2 w-2 bg-purple-500 rounded-full bottom-20 right-1/4 animate-pulse delay-500"></div>
      </div>

      <Title
        title={details.about.title.head}
        description={details.about.title.description}
      />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {details.about.details.map((detail, index) => (
          <Detail key={index} {...detail} />
        ))}
      </div>
    </Container>
  )
}
