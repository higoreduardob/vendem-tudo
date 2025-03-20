import Link from 'next/link'
import { FileText } from 'lucide-react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Title } from '@/app/(public)/_components/title'

export const Faq = () => {
  const details = {
    faq: {
      title: {
        head: 'Perguntas Frequentes',
        description:
          'Respostas para as dúvidas mais comuns sobre nossa plataforma',
      },
      details: [
        {
          title: 'Quanto custa usar a plataforma?',
          description:
            'Nossa plataforma opera com um modelo de planos de uso, com mensalidades fixas. Cobramos apenas uma o valor de uso sem porcentagem sobre cada pedido realizado, o que significa que você só paga um único valor. As mensalidades variam de acordo com o plano escolhido.',
        },
        {
          title: 'Quanto tempo leva para começar a vender?',
          description:
            'Após o pagametno e cadastro completo, a aprovação da loja ocorre no mesmo instante. Uma vez aprovado, você pode imediatamente configurar seu cardápio e começar a receber pedidos. Todo o processo, do cadastro à primeira venda, pode ser concluído em facilmente seguindo os passo a passo dos vídeos demonstrativos, ou ainda pode contar com ajuda do suporte.',
        },
        {
          title: 'Como funciona o repasse dos pagamentos?',
          description:
            'Não ficamos com seus pagamentos, eles serão pagos exclusivamente para você lojista, apenas exibimos os métodos de pagamentos que você possui para ser utilizado pelo cliente e você ter conhecimento qual forma você terá que enviar ao cliente.',
        },
        {
          title: 'Posso usar meus próprios entregadores?',
          description:
            'Sim! Nossa plataforma permite que você utilize seus próprios entregadores ou opte por serviços de entrega terceirizados de outras empresas. Você tem total flexibilidade para escolher o modelo que melhor se adapta ao seu negócio, podendo inclusive trabalhar com ambas as opções simultaneamente.',
        },
        {
          title: 'É possível migrar do meu sistema atual?',
          description:
            'Sim, oferecemos suporte de migração de outros sistemas, para melhorar e automatizar todas as suas informações já existentes, centralizando o gerenciamento de pedidos e evitando a necessidade de inserir informações em múltiplos sistemas. Entre em contato com nosso suporte para verificar as integrações disponíveis.',
        },
      ],
    },
  }

  return (
    <div>
      {/* FAQ Section */}
      <section className="bg-purple-50">
        <div className="container mx-auto space-y-10 p-4 py-10">
          <Title
            title={details.faq.title.head}
            description={details.faq.title.description}
          />

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {details.faq.details.map((faq, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger>{faq.title}</AccordionTrigger>
                  <AccordionContent>{faq.description}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Final Section */}
      <section className="bg-purple-50">
        <div className="container mx-auto px-4 text-center py-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto para vender mais? Cadastre sua loja agora e comece hoje
            mesmo!
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de lojistas que já estão aumentando suas vendas
            com nossa plataforma.
          </p>
          <Link href="/planos">
            <Button size="lg" variant="purple">
              <FileText className="mr-2 h-5 w-5" />
              Cadastrar
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
