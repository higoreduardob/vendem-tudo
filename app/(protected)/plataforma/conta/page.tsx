import { Title } from '@/app/(protected)/_components/title'
import { Form2FA, FormUpdate } from '@/features/auth/components/form-update'

export default function AccountPage() {
  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <Title>Conta</Title>
        <Form2FA />
      </div>
      <p className="text-sm text-muted-foreground">
        Preencha os campos abaixo, e ao finalizar clique em “Salvar”.
      </p>
      <FormUpdate />
    </div>
  )
}
