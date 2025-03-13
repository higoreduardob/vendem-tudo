import { Download } from 'lucide-react'

import { Button } from '@/components/ui/button'

export const Actions = () => {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" className="hidden sm:flex">
        <Download className="mr-2 h-4 w-4" />
        Exportar
      </Button>
    </div>
  )
}
