'use client'

import { toast } from 'sonner'
import { useRouter, useSearchParams } from 'next/navigation'

import {
  insertStoreDefaultValues,
  InsertStoreFormValues,
} from '@/features/stores/schema'

import { useSignUpStore } from '@/features/auth/api/use-sign-up-store'

import { ButtonLoading } from '@/components/button-custom'
import { Wrapper } from '@/features/auth/components/wrapper'
import { FormStore } from '@/features/stores/components/form-store'

export const FormSignUpStore = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  if (!token) {
    toast.error('Usuário inválido')
    router.push('/entrar')
    return null
  }

  const mutation = useSignUpStore(token)
  const isPending = mutation.isPending

  const onSubmit = (values: InsertStoreFormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        router.push('/entrar')
      },
      onError: () => {
        router.push('/entrar')
      },
    })
  }

  const handleSubmit = () => {
    document
      .getElementById('form-store')
      ?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
  }

  return (
    <Wrapper
      title="Cadastre sua loja"
      description="Preencha os campos abaixo para cadastrar sua loja"
      isFooter={false}
    >
      <FormStore
        isPending={isPending}
        defaultValues={insertStoreDefaultValues}
        onSubmit={onSubmit}
      />
      <div className="flex flex-col gap-2 mt-4">
        <ButtonLoading
          type="submit"
          onClick={handleSubmit}
          className="w-fit"
          disabled={isPending}
        >
          Cadastrar
        </ButtonLoading>
      </div>
    </Wrapper>
  )
}
