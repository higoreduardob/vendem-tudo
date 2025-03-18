import {
  ArrowRight,
  BarChart3,
  CheckCircle,
  CreditCard,
  FileText,
  HeadphonesIcon,
  LayoutDashboard,
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

export const Hero = () => {
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
            <p className="text-gray-400 text-xl">
              Cadastre sua loja, receba pedidos e gerencie tudo em um só lugar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/cadastrar">
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
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">Como Funciona</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Comece a vender online em minutos com nossa plataforma intuitiva
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center space-y-8">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Store className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Cadastre sua Loja</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Preencha seu perfil, configure sua loja e adicione seu cardápio
                na plataforma.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center text-center space-y-8">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <ShoppingBag className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Receba Pedidos</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Notificações em tempo real e gestão integrada de todos os seus
                pedidos.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center text-center space-y-8">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">
                Acompanhe seu Crescimento
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Relatórios detalhados e análise de vendas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefícios Section */}
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto space-y-10 p-4 py-10">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">
              Benefícios da Plataforma
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Tudo o que você precisa para expandir seu negócio online
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CheckCircle className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Zero Burocracia</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Fácil de configurar e começar a vender. Sem contratos longos
                  ou taxas escondidas.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CreditCard className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Pagamentos Seguros</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Integração com PIX, cartão de crédito/débito e vale-refeição
                  para maior conveniência.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <LayoutDashboard className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Dashboard Completa</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Controle total de pedidos, clientes, produtos e repasses
                  financeiros em um só lugar.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <HeadphonesIcon className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Atendimento e Suporte</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Equipe dedicada para auxiliar lojistas em todas as etapas, do
                  cadastro ao dia a dia.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
