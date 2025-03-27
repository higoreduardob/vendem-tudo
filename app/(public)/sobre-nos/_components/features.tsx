import Link from 'next/link'
import { Clock, LucideProps, Settings, ShoppingBag, Star } from 'lucide-react'

import { Button } from '@/components/ui/button'
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
    <div className="flex items-start gap-4">
      <div className="h-10 w-10 bg-purple-950/80 text-white rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
        <Icon className="h-5 w-5" />
      </div>
      <div className="text-start">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

export const Features = () => {
  const details = {
    feature: {
      title: {
        head: 'Funcionalidades completas',
        description:
          'Nossa plataforma oferece todas as ferramentas necessárias para gerenciar seu negócio de delivery do início ao fim.',
      },
      details: [
        {
          title: 'Cardápios personalizados',
          description:
            'Crie e gerencie seu cardápio com categorias, imagens, descrições detalhadas e opções de personalização. Adicione ingredientes, complementos e opções para cada item do seu menu.',
          icon: ShoppingBag,
        },
        {
          title: 'Pedidos em tempo real',
          description:
            'Receba e gerencie pedidos em tempo real, com notificações instantâneas e sistema de acompanhamento de status (pendente, aceito, em entrega, entregue).',
          icon: Clock,
        },
        {
          title: 'Personalização completa',
          description:
            'Personalize sua loja online com informações do seu estabelecimento, horários de funcionamento, métodos de pagamento aceitos e políticas específicas.',
          icon: Settings,
        },
        {
          title: 'Sistema de avaliações',
          description:
            'Permita que seus clientes avaliem os produtos e compartilhem suas experiências, ajudando a melhorar seu serviço e atrair novos clientes.',
          icon: Star,
        },
      ],
    },
    cta: {
      title: {
        head: 'Pronto para transformar seu negócio?',
        description:
          'Comece hoje mesmo a vender online e alcance mais clientes com nossa plataforma completa de delivery.',
      },
    },
  }

  return (
    <div className="bg-purple-50">
      <Container className="space-y-10 py-10 text-center">
        <Title
          title={details.feature.title.head}
          description={details.feature.title.description}
        />

        <div className="max-w-4xl mx-auto space-y-6">
          {details.feature.details.map((detail, index) => (
            <Detail key={index} {...detail} />
          ))}
        </div>

        <Title
          title={details.cta.title.head}
          description={details.cta.title.description}
        />

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/planos">
            <Button size="lg" variant="purple">
              Cadastrar
            </Button>
          </Link>
        </div>
      </Container>
    </div>
  )
}
