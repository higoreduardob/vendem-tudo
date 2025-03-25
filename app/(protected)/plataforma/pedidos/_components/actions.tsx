// import { Download } from 'lucide-react'

import { useFilterOrder } from '@/features/foods/orders/hooks/use-filter-order'

// import { Button } from '@/components/ui/button'
import { DateRangePicker } from '@/components/date-range-picker'

export const Actions = () => {
  const { from, to, onChangeFilterDate, onClearFilterDate } = useFilterOrder()

  return (
    <div className="flex items-center gap-2">
      {/* TODO: Fix error currenty day empty order */}
      <DateRangePicker
        from={from}
        to={to}
        onChangeFilterDate={onChangeFilterDate}
        onClearFilterDate={onClearFilterDate}
      />
      {/* TODO: Create export data */}
      {/* <Button variant="outline" className="hidden sm:flex">
        <Download className="mr-2 h-4 w-4" />
        Exportar
      </Button> */}
    </div>
  )
}
