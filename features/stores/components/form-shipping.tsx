'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { useFormContext, useFieldArray } from 'react-hook-form'

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

// This would typically come from an API
const MOCK_NEIGHBORHOODS = [
  { state: 'SP', city: 'São Paulo', neighborhood: 'Vila Mariana' },
  { state: 'SP', city: 'São Paulo', neighborhood: 'Moema' },
  { state: 'SP', city: 'São Paulo', neighborhood: 'Pinheiros' },
  { state: 'SP', city: 'São Paulo', neighborhood: 'Itaim Bibi' },
  { state: 'RJ', city: 'Rio de Janeiro', neighborhood: 'Copacabana' },
  { state: 'RJ', city: 'Rio de Janeiro', neighborhood: 'Ipanema' },
  { state: 'MG', city: 'Belo Horizonte', neighborhood: 'Savassi' },
]

export const FormShipping = ({ isPending }: { isPending?: boolean }) => {
  const [availableNeighborhoods, setAvailableNeighborhoods] =
    useState(MOCK_NEIGHBORHOODS)
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('')
  const [fee, setFee] = useState<number | undefined>(undefined)
  const [deadlineAt, setDeadlineAt] = useState<number | undefined>(30)
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
      // toast({
      //   title: "Error",
      //   message: "Please select a neighborhood",
      //   variant: "destructive",
      // })
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

    // Remove the added neighborhood from available options
    setAvailableNeighborhoods(
      availableNeighborhoods.filter(
        (n) => `${n.state}-${n.city}-${n.neighborhood}` !== selectedNeighborhood
      )
    )

    // Reset form fields
    setSelectedNeighborhood('')
    setFee(undefined)
    setDeadlineAt(30)
    setMinimumAmount(undefined)

    // toast({
    //   title: "Success",
    //   description: "Delivery location added successfully",
    // })
  }

  function handleRemoveLocation(index: number) {
    const locationToRemove = fields[index]

    // Add the removed neighborhood back to available options
    setAvailableNeighborhoods([
      ...availableNeighborhoods,
      {
        state: locationToRemove.state,
        city: locationToRemove.city,
        neighborhood: locationToRemove.neighborhood,
      },
    ])

    // Remove from current locations
    remove(index)

    // toast({
    //   title: "Removed",
    //   description: "Delivery location removed successfully",
    // })
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
                value={fee === undefined ? '' : fee}
                onChange={(e) =>
                  setFee(
                    e.target.value ? Number.parseInt(e.target.value) : undefined
                  )
                }
              />
            </FormControl>
          </FormItem>
          <FormItem>
            <FormLabel>Tempo de entrega (minutos)</FormLabel>
            <FormControl>
              <Input
                type="number"
                min="1"
                value={deadlineAt === undefined ? '' : deadlineAt}
                onChange={(e) =>
                  setDeadlineAt(
                    e.target.value ? Number.parseInt(e.target.value) : undefined
                  )
                }
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
                value={minimumAmount === undefined ? '' : minimumAmount}
                onChange={(e) =>
                  setMinimumAmount(
                    e.target.value ? Number.parseInt(e.target.value) : undefined
                  )
                }
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
                      <TableCell>
                        {location.fee
                          ? (location.fee / 100).toFixed(2)
                          : '0.00'}
                      </TableCell>
                      <TableCell>
                        {location.minimumAmount
                          ? (location.minimumAmount / 100).toFixed(2)
                          : '0.00'}
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
