import {
  FoodAdditionalRole,
  OrderHistoryProgress,
  ShippingRole,
  StorePayment,
  StoreRole,
  UserRole,
} from '@prisma/client'

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

export function translateStorePayment(payment: StorePayment) {
  switch (payment) {
    case 'PIX':
      return 'Pix'
    case 'MASTER_CREDIT_CARD':
      return 'Crédito - MASTER'
    case 'MASTER_DEBIT_CARD':
      return 'Débito - MASTER'
    case 'VISA_CREDIT_CARD':
      return 'Crédito - VISA'
    case 'VISA_DEBIT_CARD':
      return 'Débito - VISA'
    case 'MEAL_VOUCHER':
      return 'Vale-Refeição'
    default:
      return 'Dinheiro'
  }
}

export function translateShippingRole(role: ShippingRole) {
  switch (role) {
    case 'PICK_UP_ON_STORE':
      return 'Retirar na loja'
    default:
      return 'Delivery'
  }
}

export function translateOrderHistoryProgress(progress: OrderHistoryProgress) {
  switch (progress) {
    case 'ACCEPT':
      return 'Aceito'
    case 'CANCELLED':
      return 'Cancelado'
    case 'PENDING':
      return 'Pendente'
    case 'DELIVERED':
      return 'Entregue'
    default:
      return 'Em trânsito'
  }
}

export function translateUserRole(role: UserRole) {
  switch (role) {
    case 'ADMINISTRATOR':
      return 'Administrador'
    case 'OWNER':
      return 'Proprietário'
    case 'MANAGER':
      return 'Gerente'
    case 'EMPLOYEE':
      return 'Colaborador'
    default:
      return 'Cliente'
  }
}
