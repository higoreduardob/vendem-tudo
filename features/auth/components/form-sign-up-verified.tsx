'use client'

import { toast } from 'sonner'
import { BeatLoader } from 'react-spinners'
import { BadgeCheck, TriangleAlert } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import { useSignUpVerified } from '@/features/auth/api/use-sign-up-verified'

import { Wrapper } from '@/features/auth/components/wrapper'

type ResponseTypeProps = {
  isError: boolean
  message: string | null
}

const FormMessage = ({ isError, message }: ResponseTypeProps) => {
  if (!message) return null

  if (!isError)
    return (
      <div className="bg-emerald-500/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-emerald-500">
        <BadgeCheck className="h-4 w-4" />
        <p>{message}</p>
      </div>
    )

  return (
    <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive">
      <TriangleAlert className="h-4 w-4" />
      <p>{message}</p>
    </div>
  )
}

export const FormSignUpVerified = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [response, setResponse] = useState<ResponseTypeProps | null>(null)

  const token = searchParams.get('token')

  if (!token) {
    toast.error('Token inválido')
    router.push('/entrar')
    return null
  }

  const mutation = useSignUpVerified(token)
  const isPending = mutation.isPending

  const onSubmit = useCallback(() => {
    if (response) return

    if (!token) {
      setResponse({ isError: true, message: 'Token inválido' })
      return
    }

    mutation.mutate(
      { token },
      {
        onSuccess: (res) => {
          if ('success' in res) {
            setResponse({ isError: false, message: res.success })
          }
        },
        onError: (res) => {
          setResponse({ isError: true, message: res?.message })
        },
      }
    )
  }, [token, response])

  useEffect(() => {
    onSubmit()
  }, [onSubmit])

  return (
    <Wrapper
      title="Confirmar sua conta"
      description={
        isPending
          ? 'Aguarde enquanto verificamos sua conta'
          : 'Verificação finalizada'
      }
      footerTitle="Entrar"
      footerDescription={
        !response?.isError
          ? 'Acesse sua conta'
          : 'Tente fazer novamente a socilitação'
      }
      footerLink="/entrar"
    >
      <div className="flex items-center w-full justify-center">
        {!response && <BeatLoader />}
        {response && <FormMessage {...response} />}
      </div>
    </Wrapper>
  )
}
