import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export const Faq = () => {
  return (
    <div className="space-y-20">
      {/* Quem Pode Usar Section */}
      <section className="container mx-auto space-y-10 p-4 py-10">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">Quem Pode Usar?</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Nossa plataforma é ideal para diversos tipos de estabelecimentos
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg text-center">
            <h3 className="font-semibold mb-2">Restaurantes e Lanchonetes</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Gerencie cardápios completos e pedidos de forma eficiente.
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg text-center">
            <h3 className="font-semibold mb-2">Pizzarias e Hamburguerias</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Controle de adicionais e personalizações de pedidos.
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg text-center">
            <h3 className="font-semibold mb-2">Mercados e Conveniências</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Gestão de estoque e entrega de produtos diversos.
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg text-center">
            <h3 className="font-semibold mb-2">Docerias e Cafeterias</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Controle de produção e pedidos antecipados.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto space-y-10 p-4 py-10">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">
              Perguntas Frequentes
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Respostas para as dúvidas mais comuns sobre nossa plataforma
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  Quanto custa usar a plataforma?
                </AccordionTrigger>
                <AccordionContent>
                  Nossa plataforma opera com um modelo de comissão por venda,
                  sem mensalidades fixas. Cobramos apenas uma pequena
                  porcentagem sobre cada pedido realizado, o que significa que
                  você só paga quando efetivamente vende. As taxas variam de
                  acordo com o plano escolhido e o volume de vendas.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>
                  Quanto tempo leva para começar a vender?
                </AccordionTrigger>
                <AccordionContent>
                  Após o cadastro completo, a aprovação da loja ocorre em até 24
                  horas úteis. Uma vez aprovado, você pode imediatamente
                  configurar seu cardápio e começar a receber pedidos. Todo o
                  processo, do cadastro à primeira venda, pode ser concluído em
                  menos de 48 horas.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>
                  Como funciona o repasse dos pagamentos?
                </AccordionTrigger>
                <AccordionContent>
                  Os repasses são realizados de acordo com o método de pagamento
                  utilizado pelo cliente. Pagamentos via PIX são repassados em
                  até 1 dia útil, cartões de crédito à vista em até 14 dias, e
                  pagamentos parcelados seguem o fluxo das parcelas. Todos os
                  repasses são automatizados e você pode acompanhá-los pelo
                  dashboard.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>
                  Posso usar meus próprios entregadores?
                </AccordionTrigger>
                <AccordionContent>
                  Sim! Nossa plataforma permite que você utilize seus próprios
                  entregadores ou opte por serviços de entrega terceirizados.
                  Você tem total flexibilidade para escolher o modelo que melhor
                  se adapta ao seu negócio, podendo inclusive trabalhar com
                  ambas as opções simultaneamente.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger>
                  É possível integrar com meu sistema atual?
                </AccordionTrigger>
                <AccordionContent>
                  Sim, oferecemos integrações com diversos sistemas de PDV e
                  gestão. Nossa API permite conectar nossa plataforma com seu
                  sistema atual, centralizando o gerenciamento de pedidos e
                  evitando a necessidade de inserir informações em múltiplos
                  sistemas. Entre em contato com nosso suporte para verificar as
                  integrações disponíveis.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>
    </div>
  )
}
