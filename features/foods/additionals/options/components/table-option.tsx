import { columns } from '@/features/foods/additionals/options/components/_features/columns'

import { useFilterOption } from '@/features/foods/additionals/options/hooks/use-filter-option'
import { useGetFoodOptions } from '@/features/foods/additionals/options/api/use-get-food-options'
import { useOpenFoodOptionData } from '@/features/foods/additionals/options/hooks/use-open-food-option'
import { useBulkDeleteFoodOptions } from '@/features/foods/additionals/options/api/use-bulk-delete-food-options'

import { ContentDialog } from '@/components/content-dialog'
import { DataTable, DataTableLoading } from '@/components/data-table'

export const TableOption = () => {
  const { isOpen, onClose } = useOpenFoodOptionData()
  const optionsQuery = useGetFoodOptions()
  const options = optionsQuery.data || []
  const deleteFoodOptions = useBulkDeleteFoodOptions()
  const { onChangeStatus, status } = useFilterOption()

  const isLoading = optionsQuery.isLoading || deleteFoodOptions.isPending

  if (isLoading) {
    return (
      <ContentDialog
        title="Opções"
        description="Todas opções cadastrados no sistema"
        isOpen={isOpen}
        handleClose={onClose}
        className="max-w-[90%] xl:max-w-screen-lg"
      >
        <DataTableLoading />
      </ContentDialog>
    )
  }

  return (
    <ContentDialog
      title="Opções"
      description="Todas opções cadastrados no sistema"
      isOpen={isOpen}
      handleClose={onClose}
      className="max-w-[90%] xl:max-w-screen-lg"
    >
      <DataTable
        filterKey="name"
        placeholder="opções"
        columns={columns}
        data={options}
        isNonExportable
        onDelete={(row) => {
          const ids = row.map((r) => r.original.id)
          deleteFoodOptions.mutate({ ids })
        }}
        status={status}
        onChangeStatus={onChangeStatus}
      />
    </ContentDialog>
  )
}
