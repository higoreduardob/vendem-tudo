import { useQuery } from '@tanstack/react-query'

import { UserRole } from '@prisma/client'

import { client } from '@/lib/hono'

import { useFilterUser } from '@/features/users/hooks/use-filter-user'

export const useGetUsers = (role?: UserRole) => {
  const { status } = useFilterUser()

  const query = useQuery({
    enabled: !!role,
    queryKey: ['users', role, status],
    queryFn: async () => {
      const response = await client.api['users'].$get({
        query: { role, status },
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
