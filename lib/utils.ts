import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

import { ExtendedUser } from '@/types/next-auth'

import { cpfCnpjMask, phoneMask, zipCodeMask } from '@/lib/format'

import { UpdateFormValues } from '@/features/auth/schema'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function createEnumOptions<T extends string>(
  enumObject: Record<T, string | number>,
  translateFunction: (key: T) => string
): {
  label: string | any
  value: string | any
}[] {
  return Object.keys(enumObject).map((key) => ({
    label: translateFunction(key as T),
    value: key,
  }))
}

export async function getAddedAndRemoved(
  currValues: string[] | undefined,
  newValues: string[]
) {
  const [toAdd, toRemove] = await Promise.all([
    newValues.filter((value) => !new Set(currValues).has(value)),
    currValues?.filter((value) => !new Set(newValues).has(value)),
  ])

  return { toAdd, toRemove }
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(value)
}

export function convertAmountFromMiliunits(amount: number | null) {
  if (!amount) return 0

  return amount / 1000
}

export function convertAmountToMiliunits(
  amount: number | string | undefined | null
) {
  if (!amount) return 0

  const currAmount =
    typeof amount === 'string' ? parseFloat(amount.replace(/,/g, '.')) : amount

  return Math.round(currAmount * 1000)
}

export function calculatePercentage(min: number, max: number) {
  return min !== 0 && max > 0 ? Math.ceil((1 - min / max) * 100) : 0
}

export function mapSessionToUpdateData(sessionUser: ExtendedUser) {
  const { name, email, whatsApp, cpfCnpj, address } = sessionUser

  const formattedWhatsApp = whatsApp ? phoneMask(whatsApp) : ''
  const formattedCpfCnpj = cpfCnpj ? cpfCnpjMask(cpfCnpj) : ''

  const formattedAddress = address
    ? {
        street: address.street || '',
        neighborhood: address.neighborhood || '',
        city: address.city || '',
        state: address.state || '',
        number: address.number || '',
        zipCode: address.zipCode ? zipCodeMask(address.zipCode) : '',
        complement: address.complement || '',
      }
    : null

  const updateData = {
    name: name || '',
    email: email || '',
    whatsApp: formattedWhatsApp || '',
    cpfCnpj: formattedCpfCnpj || '',
    address: formattedAddress,
  }

  return updateData as UpdateFormValues
}
