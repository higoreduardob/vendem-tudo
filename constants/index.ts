export const DEFAULT_LOGIN_REDIRECT = '/plataforma'

export const FilterStatus: FilterOptionsProps = [
  { label: 'Todos', value: undefined },
  { label: 'Ativos', value: 'true' },
  { label: 'Bloqueados', value: 'false' },
]

export const FilterOptionsPageSize: number[] = [10, 20, 30, 40]

export const weekDays = [
  { value: 0, label: 'Domingo' },
  { value: 1, label: 'Segunda-feira' },
  { value: 2, label: 'Terça-feira' },
  { value: 3, label: 'Quarta-feira' },
  { value: 4, label: 'Quinta-feira' },
  { value: 5, label: 'Sexta-feira' },
  { value: 6, label: 'Sábado' },
]

export const numericFieldsFilter = ['quantity', 'total', 'count', 'amount']

export const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp']

export const maxImageSize = 512 * 1024 // 512KB

export const signUpWhatsAppNumber = 27998311970