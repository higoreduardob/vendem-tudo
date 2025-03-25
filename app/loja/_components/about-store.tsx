import {
  Clock,
  Mail,
  MapPin,
  Phone,
  CreditCard,
  Truck,
  Store,
  ShoppingBag,
} from 'lucide-react'
import { create } from 'zustand'
import { format } from 'date-fns'

import { ResponseType, useOpenStore } from '@/hooks/use-store'

import { weekDays } from '@/constants'

import {
  translateShippingRole,
  translateStorePayment,
  translateStoreRole,
} from '@/lib/i18n'
import { formatAddress } from '@/lib/utils'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

type OpenAboutState = {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

type ComponentProps = {
  isOpen: boolean
  handleClose: () => void
  store: ResponseType
}

export const useOpenAbout = create<OpenAboutState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}))

export const AboutStore = () => {
  const { store } = useOpenStore()
  const { isOpen, onClose } = useOpenAbout()

  if (!store) return null

  return <AboutComponent isOpen={isOpen} handleClose={onClose} store={store} />
}

const AboutComponent = ({ isOpen, handleClose, store }: ComponentProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Store className="h-6 w-6" />
            {store.name}
          </DialogTitle>
          <DialogDescription>
            Informações detalhadas sobre nossa loja
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="info">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="info">Informações</TabsTrigger>
            <TabsTrigger value="about">Sobre Nós</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4 py-2">
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-start gap-2">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-sm text-muted-foreground">
                      {store.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="font-medium">WhatsApp</h3>
                    <p className="text-sm text-muted-foreground">
                      {store.whatsApp}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h3 className="font-medium">Endereço</h3>
                  <p className="text-sm text-muted-foreground">
                    {formatAddress(store.address!)}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex items-start gap-2">
              <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h3 className="font-medium">Horários de Funcionamento</h3>
                <div className="grid grid-cols-2 gap-2">
                  {store.schedules.map((schedule, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-2 text-sm"
                    >
                      <div className="flex flex-col">
                        <span className="text-muted-foreground">
                          {
                            weekDays.find((week) => week.value === schedule.day)
                              ?.label
                          }
                        </span>
                        <span className="text-xs">
                          {schedule.enabled ? 'Aberto' : 'Fechado'}
                        </span>
                      </div>
                      <span>
                        {format(new Date(schedule.open), 'HH:mm')} -{' '}
                        {format(new Date(schedule.close), 'HH:mm')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="flex items-start gap-2">
                <CreditCard className="h-5 w-5 text-muted-foreground mt-0.5" />

                <div>
                  <h3 className="font-medium">Formas de pagamento</h3>
                  <div className="flex flex-wrap gap-1">
                    {store.payment.map((method, index) => (
                      <Badge key={index} variant="outline">
                        {translateStorePayment(method)}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Truck className="h-5 w-5 text-muted-foreground mt-0.5" />

                <div>
                  <h3 className="font-medium">Métodos de Entrega</h3>
                  <div className="flex flex-wrap gap-1">
                    {store.shippingRole.map((method, index) => (
                      <Badge key={index} variant="outline">
                        {translateShippingRole(method)}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <ShoppingBag className="h-5 w-5 text-muted-foreground mt-0.5" />

                <div>
                  <h3 className="font-medium">Tipos de Produtos</h3>
                  <div className="flex flex-wrap gap-1">
                    {store.role.map((type, index) => (
                      <Badge key={index} variant="outline">
                        {translateStoreRole(type)}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="about" className="space-y-4">
            <h3 className="font-medium mb-2">Sobre Nossa Loja</h3>
            <p className="text-muted-foreground">{store.about}</p>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-medium">Bairros de entrega</h3>

              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bairro</TableHead>
                      <TableHead>Taxa de Entrega</TableHead>
                      <TableHead>Tempo</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Pedido Mínimo
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {store.shippings.map((shipping, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {shipping.neighborhood}
                        </TableCell>

                        <TableCell>
                          {shipping.fee === 0 ? (
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-700 border-green-200"
                            >
                              Grátis
                            </Badge>
                          ) : shipping.fee ? (
                            <span>R$ {shipping.fee.toFixed(2)}</span>
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-700 border-green-200"
                            >
                              Grátis
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {shipping.deadlineAt ? (
                            <span>{shipping.deadlineAt} min</span>
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              Não informado
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {shipping.minimumAmount ? (
                            <span>R$ {shipping.minimumAmount.toFixed(2)}</span>
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              -
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button variant="outline" onClick={handleClose}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
