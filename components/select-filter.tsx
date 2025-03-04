import { cn } from '@/lib/utils'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type Props = {
  placeholder: string
  defaultValue: any
  data: FilterOptionsProps
  value: any
  isDisabled?: boolean
  className?: string
  onChange: (value: any) => void
}

export const SelectFilter = ({
  placeholder,
  defaultValue,
  data,
  value,
  isDisabled,
  className,
  onChange,
}: Props) => {
  return (
    <Select value={value} disabled={isDisabled} onValueChange={onChange}>
      <SelectTrigger className={cn('w-[180px]', className)}>
        <SelectValue placeholder={placeholder} defaultValue={defaultValue} />
      </SelectTrigger>
      <SelectContent defaultValue={defaultValue}>
        <SelectGroup>
          {data.map((item, i) => (
            <SelectItem key={i} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
