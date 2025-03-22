import { Printer } from 'lucide-react'

import { Button } from '@/components/ui/button'

type Props = {
  id: string
}

export const Actions = ({ id }: Props) => {
  return (
    <Button variant="ghost">
      <Printer className="size-4 mr-2" />
      Imprimir
    </Button>
  )
}
