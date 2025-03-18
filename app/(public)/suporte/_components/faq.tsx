import { CheckCircle2 } from 'lucide-react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'

export const Faq = () => {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="space-y-8">
        <h2 className="text-2xl font-bold">Perguntas Frequentes</h2>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-left">
              Como cadastrar minha loja?
            </AccordionTrigger>
            <AccordionContent>
              Para cadastrar sua loja, clique no botão &quot;Cadastrar&quot; no
              topo da página. Preencha o formulário com os dados da sua empresa,
              incluindo CNPJ, endereço e informações de contato. Após a
              verificação dos dados, sua loja estará pronta para ser configurada
              em nossa plataforma.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger className="text-left">
              Como gerenciar pedidos?
            </AccordionTrigger>
            <AccordionContent>
              Após fazer login, acesse o painel de controle e clique na seção
              &quot;Pedidos&quot;. Lá você poderá visualizar todos os pedidos
              recebidos, filtrar por status (novos, em preparo, em entrega,
              concluídos), aceitar ou recusar pedidos e atualizar o status
              conforme o andamento.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger className="text-left">
              Como configurar meios de pagamento?
            </AccordionTrigger>
            <AccordionContent>
              No painel administrativo, acesse &quot;Configurações&quot; e
              depois &quot;Meios de Pagamento&quot;. Você poderá integrar sua
              conta com diversos gateways de pagamento como PagSeguro, Mercado
              Pago, Stripe, entre outros. Também é possível configurar opções de
              pagamento na entrega, como dinheiro e cartão.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger className="text-left">
              Como acompanhar relatórios de vendas?
            </AccordionTrigger>
            <AccordionContent>
              Na seção &quot;Relatórios&quot; do painel, você encontrará
              gráficos e dados detalhados sobre suas vendas. É possível filtrar
              por período, visualizar produtos mais vendidos, horários de pico,
              valor médio de pedidos e muito mais. Todos os relatórios podem ser
              exportados em formato PDF ou Excel.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger className="text-left">
              Qual o prazo para recebimento dos pagamentos?
            </AccordionTrigger>
            <AccordionContent>
              O prazo para recebimento varia de acordo com o meio de pagamento
              utilizado pelo cliente e o gateway escolhido. Em geral, pagamentos
              com cartão de crédito são compensados em até 14 dias, enquanto
              pagamentos via PIX são processados em até 1 dia útil. Você pode
              acompanhar o status de todos os pagamentos na seção
              &quot;Financeiro&quot; do painel.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold">Ainda tem dúvidas?</h3>
        <p>
          Nossa equipe de suporte está disponível para ajudar você com qualquer
          questão relacionada à plataforma.
        </p>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="bg-purple-600/20 p-2 rounded-full">
              <CheckCircle2 className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <h4 className="font-medium">Suporte por chat</h4>
              <p className="text-sm text-muted-foreground">
                Disponível de segunda a sexta, das 8h às 18h
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-purple-600/20 p-2 rounded-full">
              <CheckCircle2 className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <h4 className="font-medium">Suporte por e-mail</h4>
              <p className="text-sm text-muted-foreground">
                Resposta em até 24 horas
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-purple-600/20 p-2 rounded-full">
              <CheckCircle2 className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <h4 className="font-medium">Central de ajuda</h4>
              <p className="text-sm text-muted-foreground">
                Artigos e tutoriais detalhados
              </p>
            </div>
          </div>
        </div>
        <Button size="lg" variant="purple" className="w-full">
          Falar com um especialista
        </Button>
      </div>
    </div>
  )
}
