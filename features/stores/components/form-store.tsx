import { toast } from 'sonner'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  InsertStoreFormValues,
  insertStoreSchema,
} from '@/features/stores/schema'

import { Form } from '@/components/ui/form'
import { FormDetail } from '@/features/stores/components/form-detail'
import { FormAddress } from '@/features/stores/components/form-address'
import { FormSchedule } from '@/features/stores/components/form-schedule'
import { FormShipping } from '@/features/stores/components/form-shipping'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

type Props = {
  isOpen?: boolean
  isPending?: boolean
  defaultValues: InsertStoreFormValues
  onSubmit: (values: InsertStoreFormValues) => void
}

export const FormStore = ({
  isOpen,
  isPending,
  defaultValues,
  onSubmit,
}: Props) => {
  const form = useForm<InsertStoreFormValues>({
    resolver: zodResolver(insertStoreSchema),
    defaultValues,
    shouldFocusError: true,
    reValidateMode: 'onChange',
    mode: 'all',
  })

  const schedulesError =
    form.formState.errors.schedules?.message ||
    form.formState.errors.schedules?.root?.message
  const shippingsError = form.formState.errors.shippings?.message

  const handleSubmit = (values: InsertStoreFormValues) => {
    onSubmit(values)
  }

  useEffect(() => {
    form.reset()
  }, [isOpen])

  useEffect(() => {
    if (schedulesError) toast.error(schedulesError)
    if (shippingsError) toast.error(shippingsError)
  }, [schedulesError, shippingsError, toast])

  return (
    <Form {...form}>
      <form
        id="form-store"
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 w-full h-fit">
            <TabsTrigger value="details">Informações</TabsTrigger>
            <TabsTrigger value="address">Endereço</TabsTrigger>
            <TabsTrigger value="schedules">Horários</TabsTrigger>
            <TabsTrigger value="shipping">Áreas de entrega</TabsTrigger>
          </TabsList>
          <TabsContent value="details">
            <FormDetail isPending={isPending} />
          </TabsContent>
          <TabsContent value="address">
            <FormAddress isPending={isPending} />
          </TabsContent>
          <TabsContent value="schedules">
            <FormSchedule isPending={isPending} />
          </TabsContent>
          <TabsContent value="shipping">
            <FormShipping isPending={isPending} />
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  )
}
