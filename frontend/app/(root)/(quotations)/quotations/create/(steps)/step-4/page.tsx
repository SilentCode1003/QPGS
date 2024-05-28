'use client'
import { LOCAL_STORAGE_KEY, useStepper } from '@/app/contexts/stepper'
import { useUser } from '@/app/lib/auth'
import { Box, Button, Container, NumberInput, Stack, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { readLocalStorageValue } from '@mantine/hooks'
import { z } from 'zod'

const step4Schema = z.object({
  user: z.object({
    id: z.number().gt(0),
    first_name: z.string().min(3),
    last_name: z.string().min(2).optional(),
    email: z.string().email(),
    username: z.string().min(3),
    job_title: z.string().min(1),
  }),
})

export type Step4Values = z.infer<typeof step4Schema>

export default function Step4() {
  const { updateData, incrementActive } = useStepper()

  const storageValues = readLocalStorageValue<Step4Values | undefined>({ key: LOCAL_STORAGE_KEY })

  const user = useUser()

  const initialValues = storageValues?.user?.id
    ? { ...storageValues }
    : {
        user: {
          id: user.data?.id,
          first_name: user.data?.first_name,
          last_name: user.data?.last_name,
          email: user.data?.email,
          username: user.data?.username,
          job_title: user.data?.job_title,
        },
      }

  const form = useForm<Step4Values>({
    mode: 'uncontrolled',
    initialValues,
    validate: zodResolver(step4Schema),
  })

  const onSubmit = (values: Step4Values) => {
    updateData(values)
    incrementActive()
  }

  return (
    <Container size="sm">
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack>
          <NumberInput
            label="Id"
            key={form.key('user.id')}
            {...form.getInputProps('user.id')}
            readOnly
          />

          <TextInput
            label="First name"
            key={form.key('user.first_name')}
            {...form.getInputProps('user.first_name')}
            readOnly
          />

          <TextInput
            label="Last name"
            key={form.key('user.last_name')}
            {...form.getInputProps('user.last_name')}
            readOnly
          />

          <TextInput
            label="Email"
            key={form.key('user.email')}
            {...form.getInputProps('user.email')}
            readOnly
          />

          <TextInput
            label="Username"
            key={form.key('user.username')}
            {...form.getInputProps('user.username')}
            readOnly
          />

          <TextInput
            label="Job title"
            key={form.key('user.job_title')}
            {...form.getInputProps('user.job_title')}
            readOnly
          />

          <Button type="submit">Next</Button>
        </Stack>
      </form>
    </Container>
  )
}
