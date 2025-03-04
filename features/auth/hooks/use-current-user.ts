import { useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'

import { useSignInValidate } from '@/features/auth/api/use-sign-in-validate'

export const useCurrentUser = () => {
  const { data, status, update } = useSession()
  const { mutate: validateUser } = useSignInValidate()

  useEffect(() => {
    if (data?.user?.id) {
      validateUser(
        {},
        {
          onSuccess: (res) => {
            if ('success' in res) {
              if (!res.success) {
                signOut()
              }
            }
          },
          onError: () => {
            signOut()
          },
        }
      )
    }
  }, [data?.user?.id])

  return { session: data, user: data?.user, status, update }
}
