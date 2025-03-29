'use client'

import { columns } from '@/app/(protected)/plataforma/alimentos/_features/columns'

import { useGetFoods } from '@/features/foods/api/use-get-foods'
import { useFilterFood } from '@/features/foods/hooks/use-filter-food'
import { useGetAnalytics } from '@/features/foods/api/use-get-analytics'
import { useBulkDeleteFoods } from '@/features/foods/api/use-bulk-delete-foods'

import { Skeleton } from '@/components/ui/skeleton'
import { Title } from '@/app/(protected)/_components/title'
import { DataTable, DataTableLoading } from '@/components/data-table'
import { Actions } from '@/app/(protected)/plataforma/alimentos/_components/actions'
import { Analytics } from '@/app/(protected)/plataforma/alimentos/_components/analytics'

export default function ProductsPage() {
  const foodsQuery = useGetFoods()
  const foods = foodsQuery.data || []
  const analyticsQuery = useGetAnalytics()
  const analytics = analyticsQuery.data
  const deleteFoods = useBulkDeleteFoods()

  const { onChangeStatus, status } = useFilterFood()

  const isLoading =
    foodsQuery.isLoading || deleteFoods.isPending || analyticsQuery.isLoading

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
      <Title>Produtos</Title>
      <Analytics {...analytics} />
      <DataTable
        filterKey="name"
        placeholder="produto"
        columns={columns}
        data={foods}
        onDelete={(row) => {
          const ids = row.map((r) => r.original.id)
          deleteFoods.mutate({ ids })
        }}
        status={status}
        onChangeStatus={onChangeStatus}
        filters={<Actions />}
      />
    </div>
  )
}
