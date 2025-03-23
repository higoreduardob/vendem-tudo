'use client'

import { useGetUsers } from '@/features/management/api/use-get-users'

import { DataTable } from '@/components/data-table'
import { Title } from '@/app/(protected)/_components/title'
import { columns } from './_features/columns'
import { useFilterUser } from '@/features/users/hooks/use-filter-user'
import { Actions } from './_components/actions'
import { SelectFilter } from '@/components/select-filter'
import { createEnumOptions } from '@/lib/utils'
import { UserRole } from '@prisma/client'
import { translateUserRole } from '@/lib/i18n'

export default function DashboardPage() {
  const usersQuery = useGetUsers()
  const users = usersQuery.data || []
  const { onChange, role, status } = useFilterUser()

  const roleOptions: FilterOptionsProps = createEnumOptions(UserRole, (key) =>
    translateUserRole(key as UserRole)
  )

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
          console.log(ids)
          // deleteUsers.mutate({ ids })
        }}
        // status={status}
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
