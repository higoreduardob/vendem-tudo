'use client'

import { columns } from '@/app/(protected)/plataforma/clientes/_features/columns'

import { useGetUsers } from '@/features/users/api/use-get-users'
import { useFilterUser } from '@/features/users/hooks/use-filter-user'
import { useBulkDeleteUsers } from '@/features/users/api/use-bulk-delete-users'

import { DataTable } from '@/components/data-table'
import { Title } from '@/app/(protected)/_components/title'
import { Actions } from '@/app/(protected)/plataforma/clientes/_components/actions'
import { Analytics } from '@/app/(protected)/plataforma/clientes/_components/analytics'
import { useGetAnalytics } from '@/features/customers/api/use-get-analytics'

export default function CustomersPage() {
  const customersQuery = useGetUsers('CUSTOMER')
  const customers = customersQuery.data || []
  const deleteUsers = useBulkDeleteUsers()
  const { onChange, status } = useFilterUser()
  const analytics = useGetAnalytics()

  const isLoading = customersQuery.isLoading || deleteUsers.isPending

  // TODO: Create skeleton
  if (isLoading) {
    return <>Skeleton</>
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Title>Clientes</Title>
        <Actions />
      </div>
      <Analytics {...analytics.data!} />
      <DataTable
        filterKey="name"
        placeholder="cliente"
        columns={columns}
        data={customers}
        status={status}
        onDelete={(row) => {
          const ids = row.map((r) => r.original.id)
          deleteUsers.mutate({ ids })
        }}
        onChangeStatus={onChange}
      />
    </div>
  )
}
