'use client'

import * as React from 'react'
import { Clock } from 'lucide-react'

import { cn } from '@/lib/utils'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'

interface TimePickerProps {
  value?: Date
  onChange?: (date: Date) => void
  className?: string
  disabled?: boolean
}

export function TimePicker({
  value = new Date(),
  onChange,
  className,
  disabled = false,
}: TimePickerProps) {
  const [selectedHour, setSelectedHour] = React.useState<number>(
    value.getHours()
  )
  const [selectedMinute, setSelectedMinute] = React.useState<number>(
    value.getMinutes()
  )
  const [open, setOpen] = React.useState(false)

  // Update internal state when value changes externally
  React.useEffect(() => {
    if (value) {
      setSelectedHour(value.getHours())
      setSelectedMinute(value.getMinutes())
    }
  }, [value])

  const hours = Array.from({ length: 24 }, (_, i) => i)
  const minutes = Array.from({ length: 60 }, (_, i) => i)

  const handleHourChange = (hour: number) => {
    setSelectedHour(hour)
    const newDate = new Date(value)
    newDate.setHours(hour)
    onChange?.(newDate)
  }

  const handleMinuteChange = (minute: number) => {
    setSelectedMinute(minute)
    const newDate = new Date(value)
    newDate.setMinutes(minute)
    onChange?.(newDate)
  }

  const formatTime = (hour: number, minute: number) => {
    return `${hour.toString().padStart(2, '0')}:${minute
      .toString()
      .padStart(2, '0')}`
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-[140px] justify-start text-left font-normal',
            !value && 'text-muted-foreground',
            className
          )}
          disabled={disabled}
        >
          <Clock className="mr-2 h-4 w-4" />
          {formatTime(selectedHour, selectedMinute)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex p-2 gap-2">
          <div className="flex flex-col">
            <div className="text-xs font-medium text-center py-1 text-muted-foreground">
              Horas
            </div>
            <div className="h-[200px] overflow-y-auto border rounded-md">
              {hours.map((hour) => (
                <div
                  key={hour}
                  className={cn(
                    'px-3 py-1 cursor-pointer hover:bg-muted text-center',
                    selectedHour === hour &&
                      'bg-primary text-primary-foreground'
                  )}
                  onClick={() => handleHourChange(hour)}
                >
                  {hour.toString().padStart(2, '0')}
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col">
            <div className="text-xs font-medium text-center py-1 text-muted-foreground">
              Minutos
            </div>
            <div className="h-[200px] overflow-y-auto border rounded-md">
              {minutes.map((minute) => (
                <div
                  key={minute}
                  className={cn(
                    'px-3 py-1 cursor-pointer hover:bg-muted text-center',
                    selectedMinute === minute &&
                      'bg-primary text-primary-foreground'
                  )}
                  onClick={() => handleMinuteChange(minute)}
                >
                  {minute.toString().padStart(2, '0')}
                </div>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
