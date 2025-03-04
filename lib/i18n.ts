import { FoodAdditionalRole, StoreRole } from '@prisma/client'

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

export function translateFoodAdditionalRole(role: FoodAdditionalRole) {
  switch (role) {
    case 'MULTIPLE':
      return 'Múltipla escolha'
    case 'UNIQUE':
      return 'Única escolha'
    default:
      return 'Quantidade númerica'
  }
}
