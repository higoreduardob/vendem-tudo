'use client'

import {
  insertMessageDefaultValues,
  InsertMessageFormValues,
} from '@/features/auth/schema'

import { SubTitle } from '@/app/(public)/_components/sub-title'
import { Detail } from '@/app/(public)/suporte/_components/detail'
import { FormContact } from '@/features/auth/components/form-contact'

export const Contact = () => {
  const details = {
    support: {
      title: {
        head: 'Entre em contato',
        description:
          'Preencha o formulário ao lado para enviar sua dúvida ou solicitação. Nossa equipe de suporte está pronta para ajudar você com qualquer questão relacionada à plataforma.',
      },
      details: [
        {
          title: 'Resposta rápida',
          description: 'Respondemos todas as mensagens em até 24 horas úteis',
        },
        {
          title: 'Suporte especializado',
          description: 'Nossa equipe é formada por especialistas em delivery',
        },
        {
          title: 'Acompanhamento completo',
          description:
            'Você receberá atualizações sobre o status da sua solicitação',
        },
      ],
    },
    contact: {
      title: {
        head: 'Formulário de Contato',
        description: 'Preencha os campos abaixo para enviar sua mensagem',
      },
    },
  }

  // TODO: Add smtp
  const onSubmit = (values: InsertMessageFormValues) => {
    console.log(values)
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <SubTitle
          title={details.support.title.head}
          description={details.support.title.description}
        />

        {details.support.details.map((detail, index) => (
          <Detail key={index} {...detail} />
        ))}
      </div>

      <div className="space-y-4">
        <SubTitle
          title={details.contact.title.head}
          description={details.contact.title.description}
        />

        <FormContact
          isPending={false}
          defaultValues={insertMessageDefaultValues}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  )
}
