import { Title } from '@/app/(protected)/_components/title'
import { FormUpdatePassword } from '@/features/auth/components/form-update-password'

export default function SecurityPage() {
  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <Title>Segurança</Title>
      </div>
      <p className="text-sm text-muted-foreground">
        Preencha os campos abaixo, e ao finalizar clique em “Salvar”.
      </p>
      <FormUpdatePassword />
    </div>
  )
}
