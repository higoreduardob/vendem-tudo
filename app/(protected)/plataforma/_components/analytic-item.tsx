import { cn } from '@/lib/utils'

type Props = {
  title: string
  value: string | undefined | number
  className?: string
}

// TODO: Add tooltip description
export const AnalyticItem = ({ title, value, className }: Props) => {
  return (
    <div className={cn('flex-1 border-l border-border/50 pl-4', className)}>
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      {value ? (
        <p className="mt-1 text-sm">{value}</p>
      ) : (
        <p className="mt-1 text-sm text-muted-foreground">Sem resultados</p>
      )}
    </div>
  )
}
