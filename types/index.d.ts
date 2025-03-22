declare type PasswordOptionsProps = 'STRONG' | 'GOOD' | 'WEAK'

declare type FilterOptionsProps = {
  label: string | any
  value: string | any
}[]

declare type DataField = {
  key: string
  color: string
  label: string
}

declare type VariantProps = {
  data: {
    date?: string
    [key: string]: number | string
  }[]
  fields: DataField[]
}
