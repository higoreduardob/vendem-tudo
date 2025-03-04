'use client'

import { WrapperError } from '@/components/wrapper-error'

export default function Error() {
  return (
    <WrapperError
      title="Erro inesperado"
      description="Algo deu errado do nosso lado. Estamos trabalhando para consertar
            isso. Por favor, tente novamente mais tarde."
    />
  )
}
