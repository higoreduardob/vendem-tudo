'use client'

import { WrapperError } from '@/components/wrapper-error'

export default function NotFound() {
  return (
    <WrapperError
      title="Página não encontrada"
      description="Algo deu errado do nosso lado. Estamos trabalhando para consertar
                isso. Por favor, tente novamente mais tarde."
    />
  )
}
