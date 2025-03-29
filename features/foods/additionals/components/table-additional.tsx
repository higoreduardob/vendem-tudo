import { columns } from '@/features/foods/additionals/components/_features/columns'

import { useFilterAdditional } from '@/features/foods/additionals/hooks/use-filter-additional'
import { useGetFoodAdditionals } from '@/features/foods/additionals/api/use-get-food-additionals'
import { useOpenFoodAdditionalData } from '@/features/foods/additionals/hooks/use-open-food-additional'
import { useBulkDeleteFoodAdditionals } from '@/features/foods/additionals/api/use-bulk-delete-food-additionals'

import { ContentDialog } from '@/components/content-dialog'
import { DataTable, DataTableLoading } from '@/components/data-table'

export const TableAdditional = () => {
  const { isOpen, onClose } = useOpenFoodAdditionalData()
  const additionalsQuery = useGetFoodAdditionals()
  const additionals = additionalsQuery.data || []
  const deleteFoodAdditionals = useBulkDeleteFoodAdditionals()
  const { onChangeStatus, status } = useFilterAdditional()

  const isLoading =
    additionalsQuery.isLoading || deleteFoodAdditionals.isPending

  if (isLoading) {
    return (
      <ContentDialog
        title="Adicionais"
        description="Todos adicionais cadastrados no sistema"
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
      title="Adicionais"
      description="Todos adicionais cadastrados no sistema"
      isOpen={isOpen}
      handleClose={onClose}
      className="max-w-[90%] xl:max-w-screen-lg"
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
        status={status}
        onChangeStatus={onChangeStatus}
      />
    </ContentDialog>
  )
}
