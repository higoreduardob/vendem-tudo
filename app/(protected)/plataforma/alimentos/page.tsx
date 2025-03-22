'use client'

import { columns } from '@/app/(protected)/plataforma/alimentos/_features/columns'

import { useGetFoods } from '@/features/foods/api/use-get-foods'
import { useFilterFood } from '@/features/foods/hooks/use-filter-food'
import { useBulkDeleteFoods } from '@/features/foods/api/use-bulk-delete-foods'

import { DataTable } from '@/components/data-table'
import { Title } from '@/app/(protected)/_components/title'
import { Actions } from '@/app/(protected)/plataforma/alimentos/_components/actions'
import { Analytics } from '@/app/(protected)/plataforma/alimentos/_components/analytics'

export default function ProductsPage() {
  const foodsQuery = useGetFoods()
  const foods = foodsQuery.data || []
  const deleteFoods = useBulkDeleteFoods()
  const { onChangeStatus } = useFilterFood()

  const isLoading = foodsQuery.isLoading || deleteFoods.isPending

  // TODO: Create skeleton
  if (isLoading) {
    return <>Skeleton</>
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Title>Produtos</Title>
        <Actions />
      </div>
      <Analytics />
      <DataTable
        filterKey="name"
        placeholder="produto"
        columns={columns}
        data={foods}
        onDelete={(row) => {
          const ids = row.map((r) => r.original.id)
          deleteFoods.mutate({ ids })
        }}
        onChangeStatus={onChangeStatus}
      />
    </div>
  )
}
