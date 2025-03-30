import Link from 'next/link'
// import { CheckCircle2 } from 'lucide-react'

import { signUpWhatsAppNumber } from '@/constants'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { SubTitle } from '@/app/(public)/_components/sub-title'
import { Detail } from '@/app/(public)/suporte/_components/detail'

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
          title: 'Como cadastrar minha loja?',
          description:
            'Para cadastrar sua loja, clique no botão "Cadastrar" no topo da página. Após isso selecione o plano desejado e realize o pagamento, nos encaminhe os seus dados pessoais e da sua empresa, incluindo CPF/CNPJ, endereço, informações de contato horários de funcionamento, uma descrição da sua loja e formas de pagamentos. Após a verificação dos dados, sua loja estará pronta para ser acessada em nossa plataforma.',
        },
        {
          title: 'Como gerenciar pedidos?',
          description:
            'Após fazer login, acesse o painel de controle e clique na seção "Pedidos". Lá você poderá visualizar todos os pedidos recebidos, filtrar por status (Pendente, Aceito, Em entrega, Entregues e Cancelados), aceitar ou recusar pedidos e atualizar o status conforme o andamento.',
        },
        {
          title: 'Como configurar meios de pagamento?',
          description:
            'No painel administrativo, acesse "Loja" e depois "Meios de Pagamento". Você poderá escolher diversos métodos de pagamento como PIX, cartão de crédito/débito, dinherio e vale-alimentação.',
        },
        // {
        //   title: 'Como acompanhar relatórios de vendas?',
        //   description:
        //     'Na seção "Desempenho" do painel, você encontrará gráficos e dados detalhados sobre suas vendas. É possível filtrar por período, visualizar produtos mais vendidos, horários de pico, valor médio de pedidos e muito mais. Todos os relatórios podem ser exportados em formato PDF ou Excel.',
        // },
      ],
    },
    support: {
      title: {
        head: 'Ainda tem dúvidas?',
        description:
          'Nossa equipe de suporte está disponível para ajudar você com qualquer questão relacionada à plataforma.',
      },
      details: [
        {
          title: 'Suporte por chat',
          description: 'Disponível de segunda a sexta, das 8h às 18h',
        },
        {
          title: 'Suporte por e-mail',
          description: 'Resposta em até 24 horas',
        },
        {
          title: 'Guia de uso',
          description: 'Instruções e tutoriais detalhados',
        },
      ],
    },
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="space-y-4">
        <SubTitle
          title={details.faq.title.head}
          description={details.faq.title.description}
        />

        <Accordion type="single" collapsible className="w-full">
          {details.faq.details.map((faq, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger>{faq.title}</AccordionTrigger>
              <AccordionContent>{faq.description}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div className="space-y-4">
        <SubTitle
          title={details.support.title.head}
          description={details.support.title.description}
        />

        {details.support.details.map((detail, index) => (
          <Detail key={index} {...detail} />
        ))}
        <Link
          href={`https://wa.me/${signUpWhatsAppNumber}?text=Ol%C3%A1%21%20Tenho%20interesse%20em%20assinar%20a%20plataforma%20de%20delivery%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es.%20Poderia%20me%20ajudar%3F
`}
          className="w-full"
        >
          <Button size="lg" variant="purple" className="w-full">
            Falar com um especialista
          </Button>
        </Link>
      </div>
    </div>
  )
}
