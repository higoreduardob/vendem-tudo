'use client'

import { UserRole } from '@prisma/client'
import { Wrapper } from './wrapper'
import { FormSignUp } from './form-sign-up'
import { signUpDefaultValues, SignUpFormValues } from '../schema'
import { useSignUp } from '@/features/auth/api/use-sign-up'
import { useRouter } from 'next/navigation'
import { ButtonLoading } from '@/components/button-custom'

type Props = {
  role: UserRole
  storeId?: string
  slug?: string
}

export const FormWrapperSignUp = ({ role, storeId, slug }: Props) => {
  const router = useRouter()
  const mutation = useSignUp(storeId)
  const isPending = mutation.isPending

  const defaultValues: SignUpFormValues = { ...signUpDefaultValues, role }

  const onSubmit = (values: SignUpFormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        const url = role !== 'CUSTOMER' ? '/entrar' : `/loja/${slug}/entrar`
        router.push(url)
      },
    })
  }

  const handleSubmit = () => {
    document
      .getElementById('form-sign-up')
      ?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
  }

  return (
    <Wrapper
      title="Cadastrar"
      description="Preencha os campos abaixo para criar sua conta"
      footerTitle="Entrar"
      footerDescription="Já possui uma conta?"
      footerLink={role === 'CUSTOMER' ? '/entrar' : `/loja/${slug}/entrar`}
    >
      <FormSignUp
        formId="form-sign-up"
        isPending={isPending}
        defaultValues={defaultValues}
        onSubmit={onSubmit}
      />
      <ButtonLoading
        className="w-fit mt-2"
        disabled={isPending}
        onClick={handleSubmit}
      >
        Cadastrar
      </ButtonLoading>
    </Wrapper>
  )
}
