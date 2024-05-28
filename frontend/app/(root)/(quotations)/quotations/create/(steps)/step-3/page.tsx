'use client'
import { LOCAL_STORAGE_KEY, useStepper } from '@/app/contexts/stepper'
import { Box, Button, Center, Container, Stack, TextInput, Textarea, Title } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { readLocalStorageValue } from '@mantine/hooks'
import { z } from 'zod'

const step3Schema = z.object({
  client: z.object({
    name: z.string().min(2),
    tel_no: z.string().optional(),
    contact_no: z.string(),
    email: z.string().email(),
    address: z.string().min(5),
  }),
})

export type Step3Values = z.infer<typeof step3Schema>

export default function Step3() {
  const { updateData, incrementActive } = useStepper()

  const storageValues = readLocalStorageValue<Step3Values | undefined>({ key: LOCAL_STORAGE_KEY })

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      ...storageValues,
    },
    validate: zodResolver(step3Schema),
  })

  // @ts-ignore
  const onSubmit = (values) => {
    updateData(values)
    incrementActive()
  }

  return (
    <Container size="sm">
      <Center>
        <Title>Please enter the client&apos;s details</Title>
      </Center>

      <Box mt={50}>
        <form onSubmit={form.onSubmit(onSubmit)}>
          <Stack>
            <TextInput
              withAsterisk
              label="Company name"
              key={form.key('client.name')}
              {...form.getInputProps('client.name')}
            />

            <TextInput
              withAsterisk
              label="Telephone no."
              key={form.key('client.tel_no')}
              {...form.getInputProps('client.tel_no')}
            />

            <TextInput
              withAsterisk
              label="Contact no."
              key={form.key('client.contact_no')}
              {...form.getInputProps('client.contact_no')}
            />

            <TextInput
              withAsterisk
              label="Email"
              key={form.key('client.email')}
              {...form.getInputProps('client.email')}
            />

            <Textarea
              withAsterisk
              label="Address"
              key={form.key('client.address')}
              {...form.getInputProps('client.address')}
            />

            <Button type="submit">Next</Button>
          </Stack>
        </form>
      </Box>
    </Container>
  )
}
