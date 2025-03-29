'use client'

import { Bell } from 'lucide-react'

import { useIsMobile } from '@/hooks/use-mobile'

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'

type Props = {
  isOpen: boolean
  handleClose: () => void
  children: React.ReactNode
}

const Title = () => (
  <>
    <Bell className="h-5 w-5" /> Pedidos pendentes
  </>
)

const Description = () => <>Você tem pedidos que requerem sua atenção.</>

export const Notifications = ({ isOpen, handleClose, children }: Props) => {
  const isMobile = useIsMobile()

  return !isMobile ? (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[90%] sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Title />
          </DialogTitle>
          <DialogDescription>
            <Description />
          </DialogDescription>
        </DialogHeader>
        <Separator />
        {children}
      </DialogContent>
    </Dialog>
  ) : (
    <Drawer open={isOpen} onOpenChange={handleClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="flex items-center gap-2">
            <Title />
          </DrawerTitle>
          <DrawerDescription>
            <Description />
          </DrawerDescription>
        </DrawerHeader>
        <Separator />
        {children}
      </DrawerContent>
    </Drawer>
  )
}
