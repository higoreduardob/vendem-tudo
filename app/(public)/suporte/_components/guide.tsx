import {
  BarChart3,
  CheckCircle2,
  MenuSquare,
  ShoppingBag,
  Store,
  Truck,
} from 'lucide-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { SubTitle } from '@/app/(public)/_components/sub-title'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const Guide = () => (
  <div className="space-y-4">
    <SubTitle
      title="Guia de Uso da Plataforma"
      description="Siga este guia passo a passo para configurar e utilizar nossa plataforma de delivery. Cada seção contém instruções detalhadas para ajudar você a aproveitar ao máximo todos os recursos disponíveis."
    />

    <Tabs defaultValue="cadastro" className="w-full">
      <TabsList
        className="w-full grid grid-cols-3 md:grid-cols-5 mb-8 rounded-lg p-1"
        defaultValue="signUp"
      >
        <TabsTrigger
          value="signUp"
          className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
        >
          <Store className="h-4 w-4 md:mr-2" />
          <span className="hidden md:inline">Cadastro</span>
        </TabsTrigger>
        <TabsTrigger
          value="menu"
          className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
        >
          <MenuSquare className="h-4 w-4 md:mr-2" />
          <span className="hidden md:inline">Cardápio</span>
        </TabsTrigger>
        <TabsTrigger
          value="orders"
          className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
        >
          <ShoppingBag className="h-4 w-4 md:mr-2" />
          <span className="hidden md:inline">Pedidos</span>
        </TabsTrigger>
        <TabsTrigger
          value="shippings"
          className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
        >
          <Truck className="h-4 w-4 md:mr-2" />
          <span className="hidden md:inline">Entregas</span>
        </TabsTrigger>
        <TabsTrigger
          value="reports"
          className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
        >
          <BarChart3 className="h-4 w-4 md:mr-2" />
          <span className="hidden md:inline">Relatórios</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="signUp" defaultChecked>
        <SignUp />
      </TabsContent>

      <TabsContent value="menu">
        <Menu />
      </TabsContent>

      <TabsContent value="orders">
        <Orders />
      </TabsContent>

      <TabsContent value="shippings">
        <Shippings />
      </TabsContent>

      <TabsContent value="reports">
        <Reports />
      </TabsContent>
    </Tabs>
  </div>
)

const Description = ({
  count,
  title,
  detail,
}: {
  count: number
  title: string
  detail: string
}) => {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center">
        {count}
      </div>
      <div className="space-y-1">
        <h4 className="font-medium">{title}</h4>
        <p className="text-muted-foreground text-sm">{detail}</p>
      </div>
    </div>
  )
}

const SignUp = () => {
  const options = [
    {
      title: 'Crie sua conta',
      detail:
        'Clique no botão "Cadastrar" no topo da página e preencha o formulário com seus dados pessoais e informações da empresa.',
    },
    {
      title: 'Verifique seu e-mail',
      detail:
        'Após o cadastro, você receberá um e-mail de confirmação. Clique no link para verificar sua conta.',
    },
    {
      title: 'Complete o perfil da loja',
      detail:
        'Adicione informações como logo, banner, horário de funcionamento, endereço e descrição da sua loja.',
    },
    {
      title: 'Configure meios de pagamento',
      detail:
        'Integre sua conta com gateways de pagamento e defina as opções aceitas pela sua loja.',
    },
    {
      title: 'Defina áreas de entrega',
      detail:
        'Configure as regiões atendidas pela sua loja, com taxas e tempos estimados para cada área.',
    },
  ]

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <h3 className="text-xl font-bold">Cadastro e Configuração Inicial</h3>
        <div className="space-y-6">
          {options.map((option, index) => (
            <Description
              key={index}
              count={index + 1}
              title={option.title}
              detail={option.detail}
            />
          ))}
        </div>
      </div>

      <Card className="p-0 drop-shadow-none shadow-none border-none space-y-6">
        <CardHeader>
          <CardTitle>
            <h3 className="text-xl font-bold">Tela de Configuração</h3>
          </CardTitle>
          <CardDescription>
            Exemplo da interface de configuração inicial
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-gray-700 border-dashed h-[300px] w-full flex items-center justify-center">
            <p className="text-muted-foreground">
              Imagem da tela de configuração
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2 flex items-center">
              <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
              Dica profissional
            </h4>
            <p className="text-sm text-muted-foreground">
              Complete todas as informações do perfil para aumentar a confiança
              dos clientes. Lojas com perfis completos recebem em média 30% mais
              pedidos.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const Menu = () => {
  const options = [
    {
      title: 'Crie categorias',
      detail:
        'Organize seu cardápio criando categorias como Entradas, Pratos Principais, Bebidas, Sobremesas, etc.',
    },
    {
      title: 'Adicione produtos',
      detail:
        'Para cada produto, adicione nome, descrição, preço, imagem e selecione a categoria correspondente.',
    },
    {
      title: 'Configure opções e adicionais',
      detail:
        'Crie opções personalizáveis para seus produtos, como tamanhos, sabores e adicionais com preços específicos.',
    },
    {
      title: 'Defina disponibilidade',
      detail:
        'Configure a disponibilidade de cada item, podendo ativá-los ou desativá-los conforme necessário.',
    },
    {
      title: 'Crie promoções',
      detail:
        'Configure descontos, combos e ofertas especiais para atrair mais clientes.',
    },
  ]

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <h3 className="text-xl font-bold">Gerenciamento de Cardápio</h3>
        <div className="space-y-6">
          {options.map((option, index) => (
            <Description
              key={index}
              count={index + 1}
              title={option.title}
              detail={option.detail}
            />
          ))}
        </div>
      </div>

      <Card className="p-0 drop-shadow-none shadow-none border-none space-y-6">
        <CardHeader>
          <CardTitle>
            <h3 className="text-xl font-bold">Gerenciador de Cardápio</h3>
          </CardTitle>
          <CardDescription>
            Interface de gerenciamento de produtos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-gray-700 border-dashed h-[300px] w-full flex items-center justify-center">
            <p className="text-muted-foreground">
              Imagem do gerenciador de cardápio
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2 flex items-center">
              <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
              Dica profissional
            </h4>
            <p className="text-sm text-muted-foreground">
              Fotos de alta qualidade podem aumentar as vendas em até 40%.
              Invista em boas imagens para seus produtos e mantenha descrições
              detalhadas.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const Orders = () => {
  const options = [
    {
      title: 'Receba notificações',
      detail:
        'Configure alertas sonoros e notificações por e-mail ou SMS para novos pedidos.',
    },
    {
      title: 'Aceite ou recuse pedidos',
      detail:
        'Analise os detalhes do pedido e confirme o recebimento ou recuse caso necessário.',
    },
    {
      title: 'Atualize o status',
      detail:
        'Mantenha o cliente informado atualizando o status do pedido: Confirmado, Em Preparo, Saiu para Entrega, Entregue.',
    },
    {
      title: 'Comunique-se com o cliente',
      detail:
        'Utilize o chat integrado para esclarecer dúvidas ou informar sobre alterações no pedido.',
    },
    {
      title: 'Finalize o pedido',
      detail:
        'Após a entrega, confirme a conclusão do pedido e solicite avaliação do cliente.',
    },
  ]

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <h3 className="text-xl font-bold">
          Recebimento e Processamento de Pedidos
        </h3>
        <div className="space-y-6">
          {options.map((option, index) => (
            <Description
              key={index}
              count={index + 1}
              title={option.title}
              detail={option.detail}
            />
          ))}
        </div>
      </div>

      <Card className="p-0 drop-shadow-none shadow-none border-none space-y-6">
        <CardHeader>
          <CardTitle>
            <h3 className="text-xl font-bold">Painel de Pedidos</h3>
          </CardTitle>
          <CardDescription>
            Interface de gerenciamento de pedidos em tempo real
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-gray-700 border-dashed h-[300px] w-full flex items-center justify-center">
            <p className="text-muted-foreground">Imagem do painel de pedidos</p>
          </div>
          <div>
            <h4 className="font-medium mb-2 flex items-center">
              <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
              Dica profissional
            </h4>
            <p className="text-sm text-muted-foreground">
              Responda rapidamente aos pedidos. Estabelecimentos que confirmam
              pedidos em menos de 2 minutos têm uma taxa de satisfação 25%
              maior.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const Shippings = () => {
  const options = [
    {
      title: 'Atribua pedidos',
      detail:
        'Designe pedidos para entregadores específicos ou use o sistema de atribuição automática.',
    },
    {
      title: 'Acompanhe em tempo real',
      detail:
        'Visualize a localização dos entregadores e o status das entregas em tempo real no mapa.',
    },
    {
      title: 'Avalie o desempenho',
      detail:
        'Analise métricas como tempo médio de entrega e avaliações dos clientes para cada entregador.',
    },
  ]

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <h3 className="text-xl font-bold">Monitoramento de Entregas</h3>
        <div className="space-y-6">
          {options.map((option, index) => (
            <Description
              key={index}
              count={index + 1}
              title={option.title}
              detail={option.detail}
            />
          ))}
        </div>
      </div>

      <Card className="p-0 drop-shadow-none shadow-none border-none space-y-6">
        <CardHeader>
          <CardTitle>
            <h3 className="text-xl font-bold">Rastreamento de Entregas</h3>
          </CardTitle>
          <CardDescription>Mapa de monitoramento em tempo real</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-gray-700 border-dashed h-[300px] w-full flex items-center justify-center">
            <p className="text-muted-foreground">Imagem do mapa de entregas</p>
          </div>
          <div>
            <h4 className="font-medium mb-2 flex items-center">
              <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
              Dica profissional
            </h4>
            <p className="text-sm text-muted-foreground">
              Compartilhe o link de rastreamento com os clientes. Pedidos com
              rastreamento em tempo real têm 70% menos ligações perguntando
              sobre o status da entrega.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const Reports = () => {
  const options = [
    {
      title: 'Acesse o painel',
      detail:
        'Visualize os principais indicadores de desempenho do seu negócio em um painel intuitivo.',
    },
    {
      title: 'Analise vendas',
      detail:
        'Acompanhe o faturamento diário, semanal e mensal, com comparativos de períodos anteriores.',
    },
    {
      title: 'Identifique tendências',
      detail:
        'Descubra os produtos mais vendidos, horários de pico e áreas com maior demanda.',
    },
    {
      title: 'Avalie satisfação',
      detail:
        'Monitore as avaliações dos clientes e identifique pontos de melhoria no seu serviço.',
    },
    {
      title: 'Exporte dados',
      detail:
        'Gere relatórios personalizados em PDF ou Excel para análises mais detalhadas.',
    },
  ]

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <h3 className="text-xl font-bold">Relatórios de Desempenho</h3>
        <div className="space-y-6">
          {options.map((option, index) => (
            <Description
              key={index}
              count={index + 1}
              title={option.title}
              detail={option.detail}
            />
          ))}
        </div>
      </div>

      <Card className="p-0 drop-shadow-none shadow-none border-none space-y-6">
        <CardHeader>
          <CardTitle>
            <h3 className="text-xl font-bold">Painel Analítico</h3>
          </CardTitle>
          <CardDescription>
            Painel de métricas e indicadores de desempenho
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-gray-700 border-dashed h-[300px] w-full flex items-center justify-center">
            <p className="text-muted-foreground">
              Imagem do dashboard analítico
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2 flex items-center">
              <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
              Dica profissional
            </h4>
            <p className="text-sm text-muted-foreground">
              Reserve um tempo semanal para analisar seus relatórios.
              Estabelecimentos que tomam decisões baseadas em dados têm um
              crescimento médio 35% maior que os concorrentes.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
