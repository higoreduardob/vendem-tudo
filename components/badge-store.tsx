import { cn } from '@/lib/utils'

type Props = {
  isOpen: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export const BadgeStore = ({ isOpen, className, size = 'md' }: Props) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  }

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center gap-1.5 font-medium rounded-full',
        isOpen
          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
        sizeClasses[size],
        className
      )}
    >
      <span
        className={cn(
          'block rounded-full',
          isOpen ? 'bg-green-500' : 'bg-red-500',
          size === 'sm'
            ? 'w-1.5 h-1.5'
            : size === 'md'
            ? 'w-2 h-2'
            : 'w-2.5 h-2.5'
        )}
      />
      {isOpen ? 'Loja Aberta' : 'Loja Fechada'}
    </div>
  )
}
