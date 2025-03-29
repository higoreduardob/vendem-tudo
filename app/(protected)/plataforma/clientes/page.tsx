'use client'

import { columns } from '@/app/(protected)/plataforma/clientes/_features/columns'

import { useGetUsers } from '@/features/users/api/use-get-users'
import { useFilterUser } from '@/features/users/hooks/use-filter-user'
import { useGetAnalytics } from '@/features/customers/api/use-get-analytics'
import { useBulkDeleteUsers } from '@/features/users/api/use-bulk-delete-users'

import { Skeleton } from '@/components/ui/skeleton'
import { Title } from '@/app/(protected)/_components/title'
import { DataTable, DataTableLoading } from '@/components/data-table'
import { Analytics } from '@/app/(protected)/plataforma/clientes/_components/analytics'

export default function CustomersPage() {
  const customersQuery = useGetUsers('CUSTOMER')
  const customers = customersQuery.data || []
  const analyticsQuery = useGetAnalytics()
  const analytics = analyticsQuery.data
  const deleteUsers = useBulkDeleteUsers()

  const { onChange, status } = useFilterUser()

  const isLoading =
    customersQuery.isLoading ||
    deleteUsers.isPending ||
    analyticsQuery.isLoading

  if (isLoading) {
    return (
      <div className="w-full flex flex-col gap-4">
        <Skeleton className="h-[30px] w-[300px]" />
        <Skeleton className="h-[80px] w-full" />
        <DataTableLoading />
      </div>
    )
  }

  if (!analytics) return null

  return (
    <div className="w-full flex flex-col gap-4">
      <Title>Clientes</Title>
      <Analytics {...analytics} />
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
