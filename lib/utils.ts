import slugify from 'slugify'
import { twMerge } from 'tailwind-merge'
import { clsx, type ClassValue } from 'clsx'
import { eachDayOfInterval, isSameDay } from 'date-fns'

import { ExtendedUser } from '@/types/next-auth'

import { cpfCnpjMask, phoneMask, zipCodeMask } from '@/lib/format'

import { UpdateFormValues } from '@/features/auth/schema'
import { AddressFormValues } from '@/features/common/schema'

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

export function statusFilter(status: string | undefined) {
  const regex = /^\s*(true|1|on)\s*$/i
  return status !== 'none' ? regex.test(status!) : undefined
}

export function formatAddress(address: AddressFormValues) {
  const { street, number, neighborhood, city, state, zipCode } = address

  return `${street}, ${
    number || 'S/N'
  } - ${neighborhood}, ${city} - ${state}, ${zipCode}`
}

export function mapAddress(address: AddressFormValues) {
  return {
    street: address.street || '',
    neighborhood: address.neighborhood || '',
    city: address.city || '',
    state: address.state || '',
    number: address.number || '',
    zipCode: address.zipCode ? zipCodeMask(address.zipCode) : '',
    complement: address.complement || '',
  }
}

export function generateSlug(name: string) {
  const slug = slugify(name, { lower: true, strict: true, trim: true })

  return slug
}

export function generateStrongPassword(length: number = 10): string {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const numbers = '0123456789'
  const symbols = '!@#$%^&*()_+{}[]|:;<>,.?/~'

  const allChars = uppercase + lowercase + numbers + symbols

  let password = ''

  password += uppercase[Math.floor(Math.random() * uppercase.length)]
  password += numbers[Math.floor(Math.random() * numbers.length)]
  password += symbols[Math.floor(Math.random() * symbols.length)]

  for (let i = 3; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)]
  }

  password = password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('')

  return password
}

export function fillMissingDays(
  data: VariantProps['data'],
  startDate: Date,
  endDate: Date
) {
  if (data.length === 0) {
    return []
  }

  const keys = new Set<string>()
  data.forEach((item) => {
    Object.keys(item).forEach((key) => {
      if (key !== 'date') {
        keys.add(key)
      }
    })
  })

  const allDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  })

  const transactionsByDay = allDays.map((day) => {
    const found = data.find((d) =>
      isSameDay(new Date(d.date + 'T00:00:00'), day)
    )

    if (found) {
      return { ...found, date: day.toISOString().split('T')[0] }
    } else {
      const emptyEntry: Record<string, number | string> = {
        date: day.toISOString().split('T')[0],
      }
      keys.forEach((key) => {
        emptyEntry[key] = 0
      })
      return emptyEntry
    }
  })

  return transactionsByDay
}
