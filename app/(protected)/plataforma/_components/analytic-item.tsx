import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { HelpCircle } from 'lucide-react'

type Props = {
  title: string
  description: string
  value: string | undefined | number
  className?: string
}

export const AnalyticItem = ({
  title,
  description,
  value,
  className,
}: Props) => {
  return (
    <div className={cn('flex-1 border-l border-border/50 pl-4', className)}>
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <TooltipProvider>
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <HelpCircle className="h-4 w-4 text-muted-foreground cursor-pointer" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <span className="text-sm text-white">{description}</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      {value ? (
        <p className="mt-1 text-sm">{value}</p>
      ) : (
        <p className="mt-1 text-sm text-muted-foreground">Sem resultados</p>
      )}
    </div>
  )
}
