'use client'

import { toast } from 'sonner'
import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { useFormContext, useFieldArray } from 'react-hook-form'

import { rioDasOstras } from '@/constants/neighborhoods'

import type { InsertStoreFormValues } from '@/features/stores/schema'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FormControl, FormItem, FormLabel } from '@/components/ui/form'
import { formatCurrency } from '@/lib/utils'

export const FormShipping = ({ isPending }: { isPending?: boolean }) => {
  const [availableNeighborhoods, setAvailableNeighborhoods] =
    useState(rioDasOstras)
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('')
  const [fee, setFee] = useState<number | undefined>(undefined)
  const [deadlineAt, setDeadlineAt] = useState<number | undefined>(undefined)
  const [minimumAmount, setMinimumAmount] = useState<number | undefined>(
    undefined
  )

  const {
    control,
    formState: { errors },
  } = useFormContext<InsertStoreFormValues>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'shippings',
  })

  function handleAddLocation() {
    if (!selectedNeighborhood) {
      toast.error('Selecione um bairro de entrega')
      return
    }

    const [state, city, neighborhood] = selectedNeighborhood.split('-')

    append({
      state,
      city,
      neighborhood,
      fee: fee || null,
      deadlineAt: deadlineAt || null,
      minimumAmount: minimumAmount || null,
    })

    setAvailableNeighborhoods(
      availableNeighborhoods.filter(
        (n) => `${n.state}-${n.city}-${n.neighborhood}` !== selectedNeighborhood
      )
    )

    setSelectedNeighborhood('')
    setFee(undefined)
    setDeadlineAt(undefined)
    setMinimumAmount(undefined)
  }

  function handleRemoveLocation(index: number) {
    const locationToRemove = fields[index]

    setAvailableNeighborhoods([
      ...availableNeighborhoods,
      {
        state: locationToRemove.state,
        city: locationToRemove.city,
        neighborhood: locationToRemove.neighborhood,
      },
    ])

    remove(index)
  }

  return (
    <div className="grid gap-2 md:grid-cols-2">
      <Card className="w-full border-none p-0 shadow-none">
        <CardHeader className=" border p-2 rounded-sm">
          <CardTitle className="text-sm font-medium leading-none">
            Adicionar local de entrega
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground leading-none">
            Configure taxas de entrega, valores mínimos de pedidos e prazos de
            entrega para cada bairro.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <FormItem>
            <FormLabel>Bairro</FormLabel>
            <Select
              value={selectedNeighborhood}
              onValueChange={setSelectedNeighborhood}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um bairro" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {availableNeighborhoods.map((n, index) => (
                  <SelectItem
                    key={index}
                    value={`${n.state}-${n.city}-${n.neighborhood}`}
                  >
                    {n.neighborhood}, {n.city} - {n.state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
          <FormItem>
            <FormLabel>Taxa de entrega</FormLabel>
            <FormControl>
              <Input
                type="number"
                min="0"
                step="1"
                placeholder="Taxa de entrega"
                value={fee === undefined ? '' : fee}
                onChange={(e) =>
                  setFee(
                    e.target.value ? Number.parseInt(e.target.value) : undefined
                  )
                }
                disabled={isPending}
              />
            </FormControl>
          </FormItem>
          <FormItem>
            <FormLabel>Tempo de entrega (minutos)</FormLabel>
            <FormControl>
              <Input
                type="number"
                min="1"
                placeholder="Tempo médio de entrega"
                value={deadlineAt === undefined ? '' : deadlineAt}
                onChange={(e) =>
                  setDeadlineAt(
                    e.target.value ? Number.parseInt(e.target.value) : undefined
                  )
                }
                disabled={isPending}
              />
            </FormControl>
          </FormItem>
          <FormItem>
            <FormLabel>Valor mínimo do pedido</FormLabel>
            <FormControl>
              <Input
                type="number"
                min="0"
                step="1"
                placeholder="Valor mínimo para entrega"
                value={minimumAmount === undefined ? '' : minimumAmount}
                onChange={(e) =>
                  setMinimumAmount(
                    e.target.value ? Number.parseInt(e.target.value) : undefined
                  )
                }
                disabled={isPending}
              />
            </FormControl>
          </FormItem>

          <Button type="button" onClick={handleAddLocation} className="w-full">
            <Plus className="mr-2 h-4 w-4" /> Adicionar local
          </Button>
        </CardContent>
      </Card>

      <Card className="w-full border-none p-0 shadow-none">
        <CardHeader className=" border p-2 rounded-sm">
          <CardTitle className="text-sm font-medium leading-none">
            Locais de entrega
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground leading-none">
            Seus locais de entrega configurados e seus detalhes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {fields.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum local de entrega adicionado ainda.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bairro</TableHead>
                    <TableHead>Cidade/UF</TableHead>
                    <TableHead>Taxa</TableHead>
                    <TableHead>Pedido mín</TableHead>
                    <TableHead>Tempo</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fields.map((location, index) => (
                    <TableRow key={location.id}>
                      <TableCell className="font-medium">
                        {location.neighborhood}
                      </TableCell>
                      <TableCell>
                        {location.city}/{location.state}
                      </TableCell>
                      <TableCell>{formatCurrency(location.fee || 0)}</TableCell>
                      <TableCell>
                        {formatCurrency(location.minimumAmount || 0)}
                      </TableCell>
                      <TableCell>{location.deadlineAt || '-'}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveLocation(index)}
                          className="text-destructive hover:text-destructive/90"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remover</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          {errors.shippings && (
            <p className="text-sm font-medium text-destructive mt-2">
              {errors.shippings.message}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
