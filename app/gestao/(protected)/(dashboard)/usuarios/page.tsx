'use client'

import { columns } from '@/app/gestao/(protected)/(dashboard)/usuarios/_features/columns'

import { useGetUsers } from '@/features/management/api/use-get-users'
import { useFilterUser } from '@/features/users/hooks/use-filter-user'
import { useBulkDeleteUsers } from '@/features/management/api/use-bulk-delete-users'

import { DataTable } from '@/components/data-table'
import { Title } from '@/app/(protected)/_components/title'
import { Actions } from '@/app/gestao/(protected)/(dashboard)/usuarios/_components/actions'

export default function DashboardPage() {
  const usersQuery = useGetUsers()
  const users = usersQuery.data || []
  const deleteUsers = useBulkDeleteUsers()

  const { onChange, status } = useFilterUser()

  const isLoading = usersQuery.isLoading || deleteUsers.isPending

  // TODO: Create skeleton
  if (isLoading) {
    return <>Skeleton</>
  }

  return (
    <div className="w-full flex flex-col gap-2">
      <Title>Usuários</Title>
      <DataTable
        filterKey="name"
        placeholder="usuários"
        columns={columns}
        data={users}
        onDelete={(row) => {
          const ids = row.map((r) => r.original.id)
          deleteUsers.mutate({ ids })
        }}
        status={status}
        onChangeStatus={onChange}
        filters={<Actions />}
      />
    </div>
  )
}
