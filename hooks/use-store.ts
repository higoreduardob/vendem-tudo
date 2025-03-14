import { create } from 'zustand'
import { useEffect } from 'react'
import { InferResponseType } from 'hono'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'

import { client } from '@/lib/hono'
import { phoneMask } from '@/lib/format'
import { mapAddress } from '@/lib/utils'

export type ResponseType = InferResponseType<
  (typeof client.api.stores)['slug']['$get'],
  200
>['data']

type OpenStoreState = {
  store: ResponseType | undefined
  isLoading: boolean
  onChangeStore: (store: ResponseType) => void
  onChangeLoading: (isLoading: boolean) => void
}

export const useOpenStore = create<OpenStoreState>((set) => ({
  store: undefined,
  isLoading: false,
  onChangeStore: (store: ResponseType) => set({ store }),
  onChangeLoading: (isLoading: boolean) => set({ isLoading }),
}))

export const useStore = (slug?: string) => {
  const router = useRouter()
  const { onChangeStore, onChangeLoading } = useOpenStore()

  const { data, isLoading } = useQuery({
    enabled: !!slug,
    queryKey: ['stores', slug],
    queryFn: async () => {
      onChangeLoading(true)

      const response = await client.api.stores['slug'].$get({
        query: { slug },
      })

      if (!response.ok) {
        const data = await response.json()

        throw new Error(data.error)
      }

      const { data } = await response.json()
      return {
        ...data,
        whatsApp: phoneMask(data.whatsApp),
        address: mapAddress(data.address!),
      }
    },
  })

  useEffect(() => {
    if (!isLoading && !data) {
      router.push('/')
      return
    }

    if (data) {
      onChangeStore(data)
      onChangeLoading(false)
    }
  }, [data, isLoading, onChangeStore, onChangeLoading, router])
}
