'use client'
import { useStepper } from '@/app/contexts/stepper'
import { useUser } from '@/app/lib/auth'
import { Box, Button, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { z } from 'zod'

const step4Schema = z.object({
  first_name: z.string().min(3),
  last_name: z.string().min(2).optional(),
  email: z.string().email(),
  username: z.string().min(3),
  job_title: z.string().min(1),
})

export type Step4Values = z.infer<typeof step4Schema>

export default function Step4() {
  const { updateData, incrementActive } = useStepper()

  const user = useUser()

  const form = useForm<Step4Values>({
    mode: 'uncontrolled',
    initialValues: {
      first_name: user.data?.first_name,
      last_name: user.data?.last_name,
      email: user.data?.email,
      username: user.data?.username,
      job_title: user.data?.job_title,
    },
    validate: zodResolver(step4Schema),
  })

  const onSubmit = (values: Step4Values) => {
    updateData(values)
    incrementActive()
  }

  return (
    <Box>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <TextInput
          label="First name"
          key={form.key('first_name')}
          {...form.getInputProps('first_name')}
        />

        <TextInput
          label="Last name"
          key={form.key('last_name')}
          {...form.getInputProps('last_name')}
        />

        <TextInput label="Email" key={form.key('email')} {...form.getInputProps('email')} />

        <TextInput
          label="Username"
          key={form.key('username')}
          {...form.getInputProps('username')}
        />

        <TextInput
          label="Job title"
          key={form.key('job_title')}
          {...form.getInputProps('job_title')}
        />

        <Button type="submit">Next</Button>
      </form>
    </Box>
  )
}
