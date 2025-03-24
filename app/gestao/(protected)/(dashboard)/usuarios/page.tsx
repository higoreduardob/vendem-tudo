'use client'

import { UserRole } from '@prisma/client'

import { columns } from '@/app/gestao/(protected)/(dashboard)/usuarios/_features/columns'

import { translateUserRole } from '@/lib/i18n'
import { createEnumOptions } from '@/lib/utils'

import { useGetUsers } from '@/features/management/api/use-get-users'
import { useFilterUser } from '@/features/users/hooks/use-filter-user'
import { useBulkDeleteUsers } from '@/features/management/api/use-bulk-delete-users'

import { DataTable } from '@/components/data-table'
import { SelectFilter } from '@/components/select-filter'
import { Title } from '@/app/(protected)/_components/title'
import { Actions } from '@/app/gestao/(protected)/(dashboard)/usuarios/_components/actions'

export default function DashboardPage() {
  const { onChange, role, status } = useFilterUser()
  const usersQuery = useGetUsers()
  const users = usersQuery.data || []
  const deleteUsers = useBulkDeleteUsers()

  const roleOptions: FilterOptionsProps = createEnumOptions(UserRole, (key) =>
    translateUserRole(key as UserRole)
  )

  const isLoading = usersQuery.isLoading || deleteUsers.isPending

  // TODO: Create skeleton
  if (isLoading) {
    return <>Skeleton</>
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Title>Usuários</Title>
        <Actions />
      </div>
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
        filters={
          <SelectFilter
            placeholder="Selecione tipo"
            defaultValue={undefined}
            value={role}
            data={roleOptions}
            onChange={onChange}
            className="w-full min-w-32"
          />
        }
      />
    </div>
  )
}
