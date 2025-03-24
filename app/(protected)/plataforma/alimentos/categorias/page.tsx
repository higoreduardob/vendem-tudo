'use client'

import { columns } from '@/app/(protected)/plataforma/alimentos/categorias/_features/columns'

import { useGetCategories } from '@/features/foods/categories/api/use-get-categories'
import { useFilterCategory } from '@/features/foods/categories/hooks/use-filter-category'
import { useBulkDeleteCategories } from '@/features/foods/categories/api/use-bulk-delete-categories'

import { DataTable } from '@/components/data-table'
import { Title } from '@/app/(protected)/_components/title'
import { Actions } from '@/app/(protected)/plataforma/alimentos/categorias/_components/actions'
import { Analytics } from '@/app/(protected)/plataforma/alimentos/categorias/_components/analytics'
import { useGetAnalytics } from '@/features/foods/categories/api/use-get-analytics'

export default function CategoriesPage() {
  const categoriesQuery = useGetCategories()
  const categories = categoriesQuery.data || []
  const deleteCategories = useBulkDeleteCategories()
  const { onChangeStatus, status } = useFilterCategory()
  const analyticsQuery = useGetAnalytics()
  const analytics = analyticsQuery.data

  const isLoading =
    categoriesQuery.isLoading ||
    deleteCategories.isPending ||
    analyticsQuery.isLoading

  // TODO: Create skeleton
  if (isLoading) {
    return <>Skeleton</>
  }

  if (!analytics) return null

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Title>Categorias</Title>
        <Actions />
      </div>
      {/* TODO: Get analytics */}
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
      />
    </div>
  )
}
