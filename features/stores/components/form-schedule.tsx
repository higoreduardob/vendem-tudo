import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'

import { weekDays } from '@/constants'

import { InsertStoreFormValues } from '@/features/stores/schema'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'
import { TimePicker } from '@/components/time-picker'

export const FormSchedule = ({ isPending }: { isPending?: boolean }) => {
  const form = useFormContext<InsertStoreFormValues>()

  const ensureSchedulesInitialized = () => {
    const currentSchedules = form.getValues('schedules') || []

    const initializedSchedules = weekDays.map((day) => {
      const existingSchedule = currentSchedules.find((s) => s.day === day.value)

      if (existingSchedule) {
        return existingSchedule
      }

      return {
        enabled: false,
        day: day.value,
        open: new Date(new Date().setHours(8, 0, 0, 0)),
        close: new Date(new Date().setHours(18, 0, 0, 0)),
      }
    })

    form.setValue('schedules', initializedSchedules)
  }

  useEffect(() => {
    ensureSchedulesInitialized()
  }, [])

  return (
    <Card className="w-full border-none p-0 shadow-none space-y-2">
      <CardHeader className="border p-2 rounded-sm">
        <CardTitle className="text-sm font-medium leading-none">
          Horários de Funcionamento
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground leading-none">
          Configure os horários de funcionamento da sua loja para cada dia da
          semana.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {weekDays.map((day, index) => (
          <div
            key={day.value}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 items-center"
          >
            <FormField
              control={form.control}
              name={`schedules.${index}.enabled`}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="font-medium">{day.label}</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked)

                        if (checked) {
                          form.setValue(`schedules.${index}.day`, day.value)
                        }
                      }}
                      disabled={isPending}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="text-center text-sm text-muted-foreground">
              {form.watch(`schedules.${index}.enabled`) ? 'Aberto' : 'Fechado'}
            </div>

            <FormField
              control={form.control}
              name={`schedules.${index}.open`}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Abertura</FormLabel>
                  <FormControl>
                    <TimePicker
                      value={field.value}
                      onChange={(date) => {
                        field.onChange(date)
                        form.setValue(`schedules.${index}.day`, day.value)
                      }}
                      disabled={
                        !form.watch(`schedules.${index}.enabled`) || isPending
                      }
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`schedules.${index}.close`}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Fechamento</FormLabel>
                  <FormControl>
                    <TimePicker
                      value={field.value}
                      onChange={(date) => {
                        field.onChange(date)
                        form.setValue(`schedules.${index}.day`, day.value)
                      }}
                      disabled={
                        !form.watch(`schedules.${index}.enabled`) || isPending
                      }
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`schedules.${index}.day`}
              render={({ field }) => (
                <input
                  type="hidden"
                  {...field}
                  value={day.value}
                  onChange={(e) => {
                    field.onChange(Number.parseInt(e.target.value))
                  }}
                />
              )}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
