import {
  ArrowRight,
  BarChart3,
  CheckCircle,
  CreditCard,
  FileText,
  HeadphonesIcon,
  LayoutDashboard,
  LucideProps,
  ShoppingBag,
  Store,
} from 'lucide-react'
import Link from 'next/link'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Title } from '@/app/(public)/_components/title'

type DetailProps = {
  title: string
  description: string
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
  >
}

const AboutDetail = ({ title, description, icon: Icon }: DetailProps) => {
  return (
    <div className="flex flex-col items-center text-center space-y-4">
      <div className="h-10 w-10 rounded-full bg-purple-950/80 text-white flex items-center justify-center">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

const BenefitDetail = ({ title, description, icon: Icon }: DetailProps) => {
  return (
    <Card className="space-y-4">
      <CardHeader className="flex items-center flex-row gap-4">
        <div className="h-10 w-10 rounded-full bg-purple-950/80 text-white flex items-center justify-center">
          <Icon className="h-5 w-5" />
        </div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  )
}

const WorkDetail = ({
  title,
  description,
}: {
  title: string
  description: string
}) => {
  return (
    <div className="bg-purple-50 p-6 rounded-lg text-center">
      <h3 className="font-semibold mb-2 text-purple-950">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

export const Hero = () => {
  const details = {
    about: {
      title: {
        head: 'Como Funciona',
        description:
          'Comece a vender online em minutos com nossa plataforma intuitiva',
      },
      details: [
        {
          title: 'Cadastre sua Loja',
          description:
            'Preencha seu perfil, configure sua loja e adicione seu cardápio na plataforma.',
          icon: Store,
        },
        {
          title: 'Receba Pedidos',
          description:
            'Notificações em tempo real e gestão integrada de todos os seus pedidos.',
          icon: ShoppingBag,
        },
        {
          title: 'Acompanhe seu Crescimento',
          description: 'Relatórios detalhados e análise de vendas.',
          icon: BarChart3,
        },
      ],
    },
    works: {
      title: {
        head: 'Quem Pode Usar?',
        description:
          'Nossa plataforma é ideal para diversos tipos de estabelecimentos',
      },
      details: [
        {
          title: 'Restaurantes e Lanchonetes',
          description:
            'Gerencie cardápios completos e pedidos de forma eficiente.',
        },
        {
          title: 'Pizzarias e Hamburguerias',
          description: 'Controle de adicionais e personalizações de pedidos.',
        },
        {
          title: 'Mercados e Conveniências',
          description: 'Gestão de estoque e entrega de produtos diversos.',
        },
        {
          title: 'Docerias e Cafeterias',
          description: 'Controle de produção e pedidos antecipados.',
        },
      ],
    },
    benefits: {
      title: {
        head: 'Benefícios da Plataforma',
        description: 'Tudo o que você precisa para expandir seu negócio online',
      },
      details: [
        {
          title: 'Zero Burocracia',
          description:
            'Fácil de configurar e começar a vender. Sem contratos longos ou taxas escondidas.',
          icon: CheckCircle,
        },
        {
          title: 'Pagamentos Seguros',
          description:
            'Selecione seus métodos de pagamento PIX, cartão de crédito/débito e vale-refeição para maior conveniência.',
          icon: CreditCard,
        },
        {
          title: 'Painel Completo',
          description:
            'Controle total de pedidos, clientes, produtos e financeiros em um só lugar.',
          icon: LayoutDashboard,
        },
        {
          title: 'Atendimento e Suporte',
          description:
            'Equipe dedicada para auxiliar lojistas em todas as etapas, do cadastro ao dia a dia.',
          icon: HeadphonesIcon,
        },
      ],
    },
  }

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative w-full h-[600px] md:h-[700px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50 z-10" />
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/food-delivery.webm" type="video/webm" />
          Seu navegador não suporta vídeos.
        </video>
        {/* <Image
          src="https://placehold.co/600x400"
          alt="Restaurantes e pedidos sendo preparados"
          fill
          className="object-cover"
          priority
        /> */}

        <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
              Seu Delivery, Nossa Plataforma
              <span className="text-transparent bg-white inline-block bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                Venda mais sem complicações!
              </span>
            </h1>
            <p className="text-gray-300 text-xl">
              Cadastre sua loja, receba pedidos e gerencie tudo em um só lugar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/planos">
                <Button size="lg" variant="purple">
                  <FileText className="mr-2 h-5 w-5" />
                  Cadastrar
                </Button>
              </Link>
              <Link href="/entrar">
                <Button size="lg" variant="outline">
                  <ArrowRight className="mr-2 h-5 w-5" />
                  Entrar
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona Section */}
      <section className="container mx-auto space-y-10 p-4 py-10">
        <Title
          title={details.about.title.head}
          description={details.about.title.description}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {details.about.details.map((detail, index) => (
            <AboutDetail key={index} {...detail} />
          ))}
        </div>
      </section>

      {/* Quem Pode Usar Section */}
      <section className="container mx-auto space-y-10 p-4 py-10">
        <Title
          title={details.works.title.head}
          description={details.about.title.description}
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {details.works.details.map((detail, index) => (
            <WorkDetail key={index} {...detail} />
          ))}
        </div>
      </section>

      {/* Benefícios Section */}
      <section className="bg-purple-50">
        <div className="container mx-auto space-y-10 p-4 py-10">
          <Title
            title={details.benefits.title.head}
            description={details.benefits.title.description}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {details.benefits.details.map((detail, index) => (
              <BenefitDetail key={index} {...detail} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
