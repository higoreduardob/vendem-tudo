import { columns } from '@/features/foods/additionals/options/components/_features/columns'

import { useGetFoodOptions } from '@/features/foods/additionals/options/api/use-get-food-options'
import { useOpenFoodOptionData } from '@/features/foods/additionals/options/hooks/use-open-food-option'
import { useBulkDeleteFoodOptions } from '@/features/foods/additionals/options/api/use-bulk-delete-food-options'

import { DataTable } from '@/components/data-table'
import { ContentDialog } from '@/components/content-dialog'
import { useFilterOption } from '../hooks/use-filter-option'

export const TableOption = () => {
  const { isOpen, onClose } = useOpenFoodOptionData()
  const optionsQuery = useGetFoodOptions()
  const options = optionsQuery.data || []
  const deleteFoodOptions = useBulkDeleteFoodOptions()
  const { onChangeStatus, status } = useFilterOption()

  const isLoading = optionsQuery.isLoading || deleteFoodOptions.isPending

  // TODO: Create skeleton
  if (isLoading) {
    return <>Skeleton</>
  }

  return (
    <ContentDialog
      title="Opções"
      description="Todas opções cadastrados no sistema"
      isOpen={isOpen}
      handleClose={onClose}
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
