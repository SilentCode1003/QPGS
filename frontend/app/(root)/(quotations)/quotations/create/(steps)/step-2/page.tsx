'use client'
import { LOCAL_STORAGE_KEY, useStepper } from '@/app/contexts/stepper'
import { Box, Button, TextInput, Textarea } from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { useForm, zodResolver } from '@mantine/form'
import { readLocalStorageValue } from '@mantine/hooks'
import { z } from 'zod'

const step2Schema = z.object({
  subject: z.string().min(3),
  date: z.date(),
  expiry_date: z.date(),
  notes: z.string().optional(),
  terms_and_conditions: z.string().min(3),
})

export type Step2Values = z.infer<typeof step2Schema>

export default function Step2() {
  const { updateData, incrementActive } = useStepper()

  const storageValues = readLocalStorageValue<Step2Values | undefined>({ key: LOCAL_STORAGE_KEY })

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      ...storageValues,
      date: storageValues?.date ? new Date(storageValues.date) : undefined,
      expiry_date: storageValues?.expiry_date ? new Date(storageValues.expiry_date) : undefined,
    },
    validate: zodResolver(step2Schema),
  })

  // @ts-ignore
  const onSubmit = (values) => {
    updateData(values)
    incrementActive()
  }

  return (
    <Box>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <TextInput
          withAsterisk
          label="Subject"
          key={form.key('subject')}
          {...form.getInputProps('subject')}
        />

        <DatePickerInput
          withAsterisk
          label="Date"
          key={form.key('date')}
          {...form.getInputProps('date')}
        />

        <DatePickerInput
          withAsterisk
          label="Expiry date"
          key={form.key('expiry_date')}
          {...form.getInputProps('expiry_date')}
        />

        <Textarea label="Notes" key={form.key('notes')} {...form.getInputProps('notes')} />

        <Textarea
          withAsterisk
          label="Terms and conditions"
          key={form.key('terms_and_conditions')}
          {...form.getInputProps('terms_and_conditions')}
        />

        <Button type="submit">Next</Button>
      </form>
    </Box>
  )
}
