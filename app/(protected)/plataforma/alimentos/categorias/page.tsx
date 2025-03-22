'use client'

import { columns } from '@/app/(protected)/plataforma/alimentos/categorias/_features/columns'

import { useGetCategories } from '@/features/foods/categories/api/use-get-categories'
import { useFilterCategory } from '@/features/foods/categories/hooks/use-filter-category'
import { useBulkDeleteCategories } from '@/features/foods/categories/api/use-bulk-delete-categories'

import { DataTable } from '@/components/data-table'
import { Title } from '@/app/(protected)/_components/title'
import { Actions } from '@/app/(protected)/plataforma/alimentos/categorias/_components/actions'
import { Analytics } from '@/app/(protected)/plataforma/alimentos/categorias/_components/analytics'

export default function CategoriesPage() {
  const categoriesQuery = useGetCategories()
  const categories = categoriesQuery.data || []
  const deleteCategories = useBulkDeleteCategories()
  const { onChangeStatus } = useFilterCategory()

  const isLoading = categoriesQuery.isLoading || deleteCategories.isPending

  // TODO: Create skeleton
  if (isLoading) {
    return <>Skeleton</>
  }

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <Title>Categorias</Title>
        <Actions />
      </div>
      {/* TODO: Get analytics */}
      <Analytics />
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
        onChangeStatus={onChangeStatus}
      />
    </div>
  )
}
