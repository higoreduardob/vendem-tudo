'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'
import { VariantProps } from 'class-variance-authority'
import { Loader2, Minus, Plus, Moon, Sun } from 'lucide-react'

import { Button, buttonVariants } from '@/components/ui/button'

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const ButtonLoading = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={className}
        variant={variant}
        size={size}
        asChild={asChild}
        {...props}
      >
        {props.disabled ? (
          <>
            <Loader2 className="animate-spin size-4 text-slate-300" />
            Aguarde...
          </>
        ) : (
          props.children
        )}
      </Button>
    )
  }
)
ButtonLoading.displayName = 'ButtonLoading'

export function ButthonTheme() {
  const { setTheme, theme } = useTheme()

  const toggleTheme = () => {
    theme === 'light' ? setTheme('dark') : setTheme('light')
  }

  return (
    <Button variant="ghost" onClick={toggleTheme}>
      <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Sun className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  )
}

export const ButtonCart = ({
  value,
  disabled,
  handleIncrement,
  handleDecrement,
}: {
  value: number
  disabled: boolean
  handleIncrement: () => void
  handleDecrement: () => void
}) => {
  return (
    <div className="flex items-center space-x-2 bg-white p-2 rounded-md shadow-md">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={handleDecrement}
      >
        <Minus className="text-gray-600 h-3 w-3" />
      </Button>
      <span className="mx-4 w-6 text-center">{value}</span>
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={handleIncrement}
        disabled={disabled}
      >
        <Plus className="text-[#00ccbb] h-3 w-3" />
      </Button>
    </div>
  )
}
