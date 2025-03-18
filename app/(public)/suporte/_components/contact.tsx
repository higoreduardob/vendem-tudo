'use client'

import { CheckCircle2 } from 'lucide-react'

import {
  insertMessageDefaultValues,
  InsertMessageFormValues,
} from '@/features/auth/schema'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { FormContact } from '@/features/auth/components/form-contact'

export const Contact = () => {
  const onSubmit = (values: InsertMessageFormValues) => {
    console.log(values)
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-8">
        <h2 className="text-2xl font-bold">Entre em contato</h2>
        <p>
          Preencha o formulário ao lado para enviar sua dúvida ou solicitação.
          Nossa equipe de suporte está pronta para ajudar você com qualquer
          questão relacionada à plataforma.
        </p>

        <div className="space-y-6">
          <div className="flex items-start gap-3">
            <div className="bg-purple-600/20 p-2 rounded-full">
              <CheckCircle2 className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <h4 className="font-medium">Resposta rápida</h4>
              <p className="text-sm text-muted-foreground">
                Respondemos todas as mensagens em até 24 horas úteis
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-purple-600/20 p-2 rounded-full">
              <CheckCircle2 className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <h4 className="font-medium">Suporte especializado</h4>
              <p className="text-sm text-muted-foreground">
                Nossa equipe é formada por especialistas em delivery
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-purple-600/20 p-2 rounded-full">
              <CheckCircle2 className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <h4 className="font-medium">Acompanhamento completo</h4>
              <p className="text-sm text-muted-foreground">
                Você receberá atualizações sobre o status da sua solicitação
              </p>
            </div>
          </div>
        </div>
      </div>

      <Card className="p-0 border-none drop-shadow-none shadow-none">
        <CardHeader>
          <CardTitle>
            <h3 className="text-xl font-bold">Formulário de Contato</h3>
          </CardTitle>
          <CardDescription>
            Preencha os campos abaixo para enviar sua mensagem
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormContact
            isPending={false}
            defaultValues={insertMessageDefaultValues}
            onSubmit={onSubmit}
          />
        </CardContent>
      </Card>
    </div>
  )
}
