import { cn } from '@/lib/utils'

type Props = {
  title: string
  value: string | undefined | number
  isLastItem?: boolean
}

export const AnalyticItem = ({ title, value, isLastItem }: Props) => {
  return (
    <div className={cn('flex-1', !isLastItem && 'border-r border-border/50')}>
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      {value ? (
        <p className="mt-1 text-sm">{value}</p>
      ) : (
        <p className="mt-1 text-sm text-muted-foreground">
          Não foram encontrados dados para este período
        </p>
      )}
    </div>
  )
}
