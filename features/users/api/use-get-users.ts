import { useQuery } from '@tanstack/react-query'

import { UserRole } from '@prisma/client'

import { client } from '@/lib/hono'

export const useGetUsers = (role?: UserRole) => {
  const query = useQuery({
    enabled: !!role,
    queryKey: ['users', role],
    queryFn: async () => {
      const response = await client.api['users'].$get({
        query: { role },
      })

      if (!response.ok) {
        const data = await response.json()

        throw new Error(data.error)
      }

      const { data } = await response.json()
      return data
    },
  })

  return query
}
