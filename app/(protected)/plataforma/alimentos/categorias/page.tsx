'use client'

import { columns } from '@/app/(protected)/plataforma/alimentos/categorias/_features/columns'

import { useGetAnalytics } from '@/features/foods/categories/api/use-get-analytics'
import { useGetCategories } from '@/features/foods/categories/api/use-get-categories'
import { useFilterCategory } from '@/features/foods/categories/hooks/use-filter-category'
import { useBulkDeleteCategories } from '@/features/foods/categories/api/use-bulk-delete-categories'

import { Skeleton } from '@/components/ui/skeleton'
import { Title } from '@/app/(protected)/_components/title'
import { DataTable, DataTableLoading } from '@/components/data-table'
import { Actions } from '@/app/(protected)/plataforma/alimentos/categorias/_components/actions'
import { Analytics } from '@/app/(protected)/plataforma/alimentos/categorias/_components/analytics'

export default function CategoriesPage() {
  const categoriesQuery = useGetCategories()
  const categories = categoriesQuery.data || []
  const analyticsQuery = useGetAnalytics()
  const analytics = analyticsQuery.data
  const deleteCategories = useBulkDeleteCategories()

  const { onChangeStatus, status } = useFilterCategory()

  const isLoading =
    categoriesQuery.isLoading ||
    deleteCategories.isPending ||
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
      <Title>Categorias</Title>
      <Analytics {...analytics} />
      <DataTable
        filterKey="name"
        placeholder="categoria"
        columns={columns}
        data={categories}
        isNonExportable
        onDelete={(row) => {
          const ids = row.map((r) => r.original.id)
          deleteCategories.mutate({ ids })
        }}
        status={status}
        onChangeStatus={onChangeStatus}
        filters={<Actions />}
      />
    </div>
  )
}
