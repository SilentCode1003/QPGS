'use client'

import { useCreateClient } from '@/api/clients/create'
import {
  CreateClientInput,
  createClientSchema,
} from '@/app/(protected)/(admin)/clients/create/schema'
import { Button, Group, Stack, Textarea, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { IconPlus } from '@tabler/icons-react'
import { zodResolver } from 'mantine-form-zod-resolver'

export default function CreateClient() {
  const form = useForm<CreateClientInput>({
    mode: 'uncontrolled',
    initialValues: {
      name: '',
      contact_no: '',
      email: '',
      address: '',
      tel_no: null,
    },
    validate: zodResolver(createClientSchema),
  })

  const { mutateAsync: createClient, isPending } = useCreateClient()

  const handleSubmit = async (values: typeof form.values) => {
    const transformedValues = {
      ...values,
      tel_no: values.tel_no === '' ? null : values.tel_no,
    }

    try {
      await createClient(transformedValues)
      notifications.show({
        title: 'Success',
        message: 'Client successfully created',
        color: 'green',
      })
      form.reset()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            label="Name"
            placeholder="Client name"
            key={form.key('name')}
            {...form.getInputProps('name')}
          />

          <TextInput
            label="Telephone No. (Optional)"
            placeholder="Telephone number"
            key={form.key('tel_no')}
            {...form.getInputProps('tel_no')}
          />

          <TextInput
            label="Contact No."
            placeholder="Contact number"
            key={form.key('contact_no')}
            {...form.getInputProps('contact_no')}
          />

          <TextInput
            label="Email"
            placeholder="Client email"
            key={form.key('email')}
            {...form.getInputProps('email')}
          />

          <Textarea
            label="Address"
            placeholder="Client address"
            key={form.key('address')}
            {...form.getInputProps('address')}
          />
        </Stack>

        <Group mt="xl" justify="end">
          <Button leftSection={<IconPlus size={16} />} type="submit" disabled={isPending}>
            Create
          </Button>
        </Group>
      </form>
    </div>
  )
}
