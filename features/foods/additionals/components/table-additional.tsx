import { columns } from '@/features/foods/additionals/components/_features/columns'

import { useGetFoodAdditionals } from '@/features/foods/additionals/api/use-get-food-additionals'
import { useOpenFoodAdditionalData } from '@/features/foods/additionals/hooks/use-open-food-additional'
import { useBulkDeleteFoodAdditionals } from '@/features/foods/additionals/api/use-bulk-delete-food-additionals'

import { DataTable } from '@/components/data-table'
import { ContentDialog } from '@/components/content-dialog'
import { useFilterAdditional } from '../hooks/use-filter-additional'

export const TableAdditional = () => {
  const { isOpen, onClose } = useOpenFoodAdditionalData()
  const additionalsQuery = useGetFoodAdditionals()
  const additionals = additionalsQuery.data || []
  const deleteFoodAdditionals = useBulkDeleteFoodAdditionals()
  const { onChangeStatus } = useFilterAdditional()

  const isLoading =
    additionalsQuery.isLoading || deleteFoodAdditionals.isPending

  // TODO: Create skeleton
  if (isLoading) {
    return <>Skeleton</>
  }

  return (
    <ContentDialog
      title="Adicionais"
      description="Todos adicionais cadastrados no sistema"
      isOpen={isOpen}
      handleClose={onClose}
    >
      <DataTable
        filterKey="name"
        placeholder="adicional"
        columns={columns}
        data={additionals}
        isNonExportable
        onDelete={(row) => {
          const ids = row.map((r) => r.original.id)
          deleteFoodAdditionals.mutate({ ids })
        }}
        onChangeStatus={onChangeStatus}
      />
    </ContentDialog>
  )
}
