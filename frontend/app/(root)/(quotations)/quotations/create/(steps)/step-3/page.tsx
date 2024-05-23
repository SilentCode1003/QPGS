'use client'
import { Box, Button, TextInput, Textarea } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { z } from 'zod'

const step3Schema = z.object({
  name: z.string().min(2),
  tel_no: z.string().optional(),
  contact_no: z.string(),
  email: z.string().email(),
  address: z.string().min(5),
})

type Step3Values = z.infer<typeof step3Schema>

export default function Step3() {
  const form = useForm<Step3Values>({
    mode: 'uncontrolled',
    validate: zodResolver(step3Schema),
  })

  const onSubmit = (values: Step3Values) => {
    console.log(values)
    // console.log(JSON.stringify(values))
  }

  return (
    <Box>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <TextInput
          withAsterisk
          label="Company name"
          key={form.key('name')}
          {...form.getInputProps('name')}
        />

        <TextInput
          withAsterisk
          label="Telephone no."
          key={form.key('tel_no')}
          {...form.getInputProps('tel_no')}
        />

        <TextInput
          withAsterisk
          label="Contact no."
          key={form.key('contact_no')}
          {...form.getInputProps('contact_no')}
        />

        <TextInput
          withAsterisk
          label="Email"
          key={form.key('email')}
          {...form.getInputProps('email')}
        />

        <Textarea
          withAsterisk
          label="Address"
          key={form.key('address')}
          {...form.getInputProps('address')}
        />

        <Button type="submit">Next</Button>
      </form>
    </Box>
  )
}
