import { StoreRole } from '@prisma/client'

export function translatePasswordOptionsProps(option: PasswordOptionsProps) {
  switch (option) {
    case 'STRONG':
      return 'Forte'
    case 'GOOD':
      return 'Bom'
    default:
      return 'Fraca'
  }
}

export function translateStoreRole(role: StoreRole) {
  switch (role) {
    default:
      return 'Alimentação'
  }
}
