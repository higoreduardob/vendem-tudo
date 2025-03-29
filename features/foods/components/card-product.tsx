import Image from 'next/image'
import { InferResponseType } from 'hono'
import { ShoppingCart, X } from 'lucide-react'
import { useFormContext, useWatch } from 'react-hook-form'

import { FoodAdditionalRole } from '@prisma/client'

import { client } from '@/lib/hono'
import { calculatePercentage, cn, formatCurrency } from '@/lib/utils'

import type { InsertProductInCartFormValues } from '@/features/foods/orders/schema'

import { useOpenCart } from '@/features/foods/orders/components/form-cart'

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { ButtonCart } from '@/components/button-custom'
import { ScrollArea } from '@/components/ui/scroll-area'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

export type ResponseType = InferResponseType<
  (typeof client.api.foods.stores)[':storeId']['$get'],
  200
>['data'][0]

export const CardProduct = ({ ...product }: ResponseType) => {
  const { onOpen } = useOpenCart()
  const { name, reviewsAmount, reviewsAvg } = product

  return (
    <Card className="overflow-hidden p-0">
      <ProductImage {...product} />
      <CardHeader className="px-2 pt-2">
        <h3 className="font-semibold">{name}</h3>
      </CardHeader>
      <CardContent className="px-2">
        <ProductPrice {...product} />
        <p
          className={cn(
            'text-sm text-muted-foreground line-clamp-1',
            reviewsAmount && reviewsAvg && 'text-yellow-600'
          )}
        >
          {reviewsAmount && reviewsAvg
            ? `${reviewsAmount} (${reviewsAvg} ★)`
            : 'Sem avaliação'}
        </p>
      </CardContent>
      <CardFooter className="p-2">
        <Button
          className="w-full gap-2"
          variant="red"
          onClick={() => onOpen(product)}
        >
          <ShoppingCart className="h-4 w-4" />
          Adicionar
        </Button>
      </CardFooter>
    </Card>
  )
}

export const ProductImage = ({
  className,
  ...product
}: ResponseType & { className?: string }) => {
  const { name, image, price, promotion } = product
  return (
    <div className={cn('relative aspect-square overflow-hidden', className)}>
      <Image
        src={image || '/placeholder.svg'}
        alt={name}
        width={300}
        height={300}
        className="h-full w-full object-cover transition-transform hover:scale-105"
      />

      {promotion! > 0 && (
        <Badge className="absolute right-2 top-2 text-white uppercase bg-yellow-500">
          {calculatePercentage(promotion!, price)}% desconto
        </Badge>
      )}
    </div>
  )
}

export const ProductPrice = ({ price, promotion }: ResponseType) => {
  return (
    <div className="text-lg font-semibold">
      {promotion ? (
        <>
          <span className="text-red-600">{formatCurrency(promotion)}</span>{' '}
          <span className="text-sm text-gray-500 line-through">
            {formatCurrency(price)}
          </span>
        </>
      ) : (
        formatCurrency(price)
      )}
    </div>
  )
}

export const ProductDetails = ({
  description,
  ingredients,
}: {
  description: string
  ingredients: string[]
}) => {
  return (
    <ScrollArea className="max-h-[330px] pr-1">
      <div className="flex flex-col gap-2">
        <div>
          <h4 className="font-semibold">Descrição:</h4>
          <div
            dangerouslySetInnerHTML={{
              __html: description,
            }}
          />
        </div>
        {ingredients && ingredients.length > 0 && (
          <div>
            <h4 className="font-semibold">Ingredientes:</h4>
            <ul className="list-inside list-disc text-sm">
              {ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </ScrollArea>
  )
}

type FoodOption = {
  id: string
  name: string
  description: string
  price: number
  status: boolean
}

type FoodAdditionalOption = {
  foodOptionId: string
  foodAdditionalId: string
  foodOption: FoodOption
}

type FoodAdditional = {
  id: string
  name: string
  description: string
  minRequired: number | null
  limit: number | null
  required: boolean
  status: boolean
  role: FoodAdditionalRole
  options: FoodAdditionalOption[]
}

export function ProductAdditionals({ ...product }: ResponseType) {
  const { additionals } = product

  const form = useFormContext<InsertProductInCartFormValues>()
  const formAdditionals = useWatch({
    control: form.control,
    name: 'additionals',
  })

  const isOptionSelected = (additionalId: string, optionId: string) => {
    const additional = formAdditionals?.find(
      (add) => add.additionalId === additionalId
    )
    return additional?.options.some((opt) => opt.optionId === optionId) || false
  }

  const getOptionQuantity = (additionalId: string, optionId: string) => {
    const additional = formAdditionals?.find(
      (add) => add.additionalId === additionalId
    )
    return (
      additional?.options.find((opt) => opt.optionId === optionId)?.quantity ||
      0
    )
  }

  const getTotalSelectedCount = (additionalId: string) => {
    const additional = formAdditionals?.find(
      (add) => add.additionalId === additionalId
    )
    return (
      additional?.options.reduce(
        (total, option) => total + option.quantity,
        0
      ) || 0
    )
  }

  const isLimitReached = (additionalId: string, limit: number | null) => {
    if (limit === null) return false
    return getTotalSelectedCount(additionalId) >= limit
  }

  const updateAdditionalOption = (
    additionalId: string,
    additionalName: string,
    optionId: string,
    optionName: string,
    price: number,
    quantity: number,
    role: string
  ) => {
    const currentAdditionals = form.getValues('additionals') || []
    let updatedAdditionals = [...currentAdditionals]
    const additionalIndex = updatedAdditionals.findIndex(
      (add) => add.additionalId === additionalId
    )

    if (additionalIndex === -1) {
      // Adicionar novo adicional
      updatedAdditionals.push({
        additionalId,
        name: additionalName,
        options: [
          {
            optionId,
            name: optionName,
            quantity,
            price,
          },
        ],
      })
    } else {
      const additional = updatedAdditionals[additionalIndex]
      const optionIndex = additional.options.findIndex(
        (opt) => opt.optionId === optionId
      )

      if (optionIndex === -1) {
        // Adicionar nova opção
        if (role === 'UNIQUE') {
          // Para UNIQUE, substituir todas as opções
          additional.options = [
            {
              optionId,
              name: optionName,
              quantity,
              price,
            },
          ]
        } else {
          // Para outros tipos, adicionar à lista de opções
          additional.options.push({
            optionId,
            name: optionName,
            quantity,
            price,
          })
        }
      } else {
        // Atualizar opção existente
        if (quantity === 0) {
          // Remover opção se a quantidade for 0
          additional.options = additional.options.filter(
            (opt) => opt.optionId !== optionId
          )
        } else {
          additional.options[optionIndex].quantity = quantity
        }
      }

      // Remover o adicional se não houver mais opções
      if (additional.options.length === 0) {
        updatedAdditionals = updatedAdditionals.filter(
          (add) => add.additionalId !== additionalId
        )
      }
    }

    form.setValue('additionals', updatedAdditionals)
  }

  const clearUniqueOption = (additionalId: string) => {
    const currentAdditionals = form.getValues('additionals') || []
    const updatedAdditionals = currentAdditionals.filter(
      (add) => add.additionalId !== additionalId
    )
    form.setValue('additionals', updatedAdditionals)
  }

  const renderAdditionalOptions = (additional: FoodAdditional) => {
    const { id, name, role, options, limit } = additional

    switch (role) {
      case 'MULTIPLE':
        const limitReached = isLimitReached(id, limit)
        return (
          <div className="space-y-2">
            {options.map(({ foodOption }) => {
              const isSelected = isOptionSelected(id, foodOption.id)
              return (
                <div
                  key={foodOption.id}
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    id={`${id}-${foodOption.id}`}
                    checked={isSelected}
                    disabled={!isSelected && limitReached}
                    onCheckedChange={(checked) => {
                      updateAdditionalOption(
                        id,
                        name,
                        foodOption.id,
                        foodOption.name,
                        foodOption.price,
                        checked ? 1 : 0,
                        role
                      )
                    }}
                  />
                  <div className="flex flex-1 items-center justify-between">
                    <label
                      htmlFor={`${id}-${foodOption.id}`}
                      className={`text-sm font-medium leading-none ${
                        !isSelected && limitReached ? 'text-gray-400' : ''
                      }`}
                    >
                      {foodOption.name}
                      <p className="text-xs text-muted-foreground">
                        {foodOption.description}
                      </p>
                    </label>
                    <span className="text-sm font-medium">
                      {formatCurrency(foodOption.price)}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )

      case 'UNIQUE':
        const selectedOptionId = formAdditionals?.find(
          (add) => add.additionalId === id
        )?.options[0]?.optionId
        return (
          <div>
            <RadioGroup
              value={selectedOptionId || ''}
              onValueChange={(value) => {
                const option = options.find(
                  (opt) => opt.foodOption.id === value
                )
                if (option) {
                  updateAdditionalOption(
                    id,
                    name,
                    option.foodOption.id,
                    option.foodOption.name,
                    option.foodOption.price,
                    1,
                    role
                  )
                }
              }}
            >
              <div className="space-y-2">
                {options.map(({ foodOption }) => (
                  <div
                    key={foodOption.id}
                    className="flex items-center space-x-2"
                  >
                    <RadioGroupItem
                      value={foodOption.id}
                      id={`${id}-${foodOption.id}`}
                    />
                    <div className="flex flex-1 items-center justify-between">
                      <label
                        htmlFor={`${id}-${foodOption.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {foodOption.name}
                        <p className="text-xs text-muted-foreground">
                          {foodOption.description}
                        </p>
                      </label>
                      <span className="text-sm font-medium">
                        {formatCurrency(foodOption.price)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </RadioGroup>
            {selectedOptionId && (
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => clearUniqueOption(id)}
              >
                <X className="h-4 w-4 mr-2" />
                Limpar opção
              </Button>
            )}
          </div>
        )

      case 'QUANTITY':
        const totalCount = getTotalSelectedCount(id)
        return (
          <div className="space-y-2">
            {options.map(({ foodOption }) => {
              const quantity = getOptionQuantity(id, foodOption.id)
              const isMaxReached = limit !== null && totalCount >= limit

              return (
                <div
                  key={foodOption.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium">{foodOption.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {foodOption.description}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">
                      {formatCurrency(foodOption.price)}
                    </span>
                    <ButtonCart
                      value={quantity}
                      handleDecrement={() => {
                        const newQuantity = Math.max(0, quantity - 1)
                        updateAdditionalOption(
                          id,
                          name,
                          foodOption.id,
                          foodOption.name,
                          foodOption.price,
                          newQuantity,
                          role
                        )
                      }}
                      handleIncrement={() => {
                        const newQuantity = quantity + 1
                        updateAdditionalOption(
                          id,
                          name,
                          foodOption.id,
                          foodOption.name,
                          foodOption.price,
                          newQuantity,
                          role
                        )
                      }}
                      disabled={isMaxReached}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )

      default:
        return null
    }
  }

  const getOptionsForAdditional = (additionalId: string) => {
    const additional = formAdditionals?.find(
      (add) => add.additionalId === additionalId
    )
    return additional?.options || []
  }

  if (!additionals || additionals.length === 0) {
    return null
  }

  return (
    <div className="space-y-2">
      {additionals.map(({ foodAdditional }) => {
        const { id, name, description, required, minRequired, limit, role } =
          foodAdditional

        const selectedOptions = getOptionsForAdditional(id)
        const selectedCount = selectedOptions.reduce(
          (acc, opt) => acc + opt.quantity,
          0
        )

        const isValid =
          !required || (required && selectedCount >= (minRequired || 1))

        return (
          <Card key={id} className="border-gray-200">
            <CardHeader>
              <div className="flex items-center flex-col xs:flex-row justify-between">
                <CardTitle className="text-lg font-bold">
                  {name}
                  {required && <span className="text-red-500 ml-1">*</span>}
                </CardTitle>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex gap-2">
                    {(role === 'MULTIPLE' || role === 'QUANTITY') && limit && (
                      <Badge variant="outline">Máx: {limit}</Badge>
                    )}
                    {((role === 'MULTIPLE' || role === 'QUANTITY') &&
                      required &&
                      minRequired) ||
                    (role === 'UNIQUE' && required) ? (
                      <Badge variant="outline">Mín: {minRequired || 1}</Badge>
                    ) : null}
                  </div>
                  {(role === 'MULTIPLE' || role === 'QUANTITY') && limit && (
                    <span className="text-xs text-muted-foreground">
                      {selectedCount}/{limit}{' '}
                      {role === 'MULTIPLE' ? 'opções' : 'itens'} selecionados
                    </span>
                  )}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{description}</p>
            </CardHeader>
            <CardContent>
              {renderAdditionalOptions(foodAdditional)}
              {required && !isValid && (
                <p className="text-sm text-red-500 mt-2">
                  {role === 'UNIQUE'
                    ? 'Selecione uma opção'
                    : `Selecione pelo menos ${minRequired || 1} ${
                        role === 'QUANTITY' ? 'item(ns)' : 'opção(ões)'
                      }`}
                </p>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
