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
import { useEffect } from 'react'

export const FormSchedule = ({ isPending }: { isPending?: boolean }) => {
  const form = useFormContext<InsertStoreFormValues>()

  // Ensure schedules array is initialized with day values
  const ensureSchedulesInitialized = () => {
    const currentSchedules = form.getValues('schedules') || []

    // If schedules is empty or doesn't have all days, initialize it
    if (currentSchedules.length < weekDays.length) {
      const initializedSchedules = weekDays.map((day, index) => {
        // Try to find existing schedule for this day
        const existingSchedule = currentSchedules.find(
          (s) => s.day === day.value
        )

        if (existingSchedule) {
          return existingSchedule
        }

        // Create new schedule with day value
        return {
          enabled: false,
          day: day.value, // This is the key part - setting day to the weekDay value
          open: new Date(new Date().setHours(8, 0, 0, 0)),
          close: new Date(new Date().setHours(18, 0, 0, 0)),
        }
      })

      // Update the form with initialized schedules
      form.setValue('schedules', initializedSchedules)
    }
  }

  // Call the initialization function
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
          <div key={day.value} className="grid grid-cols-4 gap-2 items-center">
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

                        // When enabling, ensure the day value is set correctly
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
                        // Ensure day value is set when time is changed
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
                        // Ensure day value is set when time is changed
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

            {/* Hidden field to store the day value */}
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

// export const FormSchedule = ({ isPending }: { isPending?: boolean }) => {
//   const form = useFormContext<InsertStoreFormValues>()

//   return (
//     <Card className="w-full border-none p-0 shadow-none space-y-2">
//       <CardHeader className=" border p-2 rounded-sm">
//         <CardTitle className="text-sm font-medium leading-none">
//           Horários de Funcionamento
//         </CardTitle>
//         <CardDescription className="text-xs text-muted-foreground leading-none">
//           Configure os horários de funcionamento da sua loja para cada dia da
//           semana.
//         </CardDescription>
//       </CardHeader>
//       <CardContent className="flex flex-col gap-2">
//         {weekDays.map((day, index) => (
//           <div key={index} className="grid grid-cols-4 gap-2 items-center">
//             <FormField
//               control={form.control}
//               name={`schedules.${index}.enabled`}
//               render={({ field }) => (
//                 <FormItem className="flex flex-col">
//                   <FormLabel className="font-medium">{day.label}</FormLabel>
//                   <FormControl>
//                     <Switch
//                       checked={field.value}
//                       onCheckedChange={field.onChange}
//                       disabled={isPending}
//                     />
//                   </FormControl>
//                 </FormItem>
//               )}
//             />

//             <div className="text-center text-sm text-muted-foreground">
//               {form.watch(`schedules.${index}.enabled`) ? 'Aberto' : 'Fechado'}
//             </div>

//             <FormField
//               control={form.control}
//               name={`schedules.${index}.open`}
//               render={({ field }) => (
//                 <FormItem className="flex flex-col">
//                   <FormLabel>Abertura</FormLabel>
//                   <FormControl>
//                     <TimePicker
//                       value={field.value}
//                       onChange={field.onChange}
//                       disabled={
//                         !form.watch(`schedules.${index}.enabled`) || isPending
//                       }
//                       className="w-full"
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name={`schedules.${index}.close`}
//               render={({ field }) => (
//                 <FormItem className="flex flex-col">
//                   <FormLabel>Fechamento</FormLabel>
//                   <FormControl>
//                     <TimePicker
//                       value={field.value}
//                       onChange={field.onChange}
//                       disabled={
//                         !form.watch(`schedules.${index}.enabled`) || isPending
//                       }
//                       className="w-full"
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>
//         ))}
//       </CardContent>
//     </Card>
//   )
// }
