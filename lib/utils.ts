import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

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
