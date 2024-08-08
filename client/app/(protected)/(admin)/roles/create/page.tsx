'use client'

import { useCreateRole } from '@/api/roles/create'
import { Button, Container, Group, Paper, Stack, TextInput, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { IconPlus } from '@tabler/icons-react'
import { zodResolver } from 'mantine-form-zod-resolver'
import { CreateRoleInput, createRoleSchema } from './schema'

export default function CreateRole() {
  const form = useForm<CreateRoleInput>({
    mode: 'uncontrolled',
    initialValues: {
      name: '',
    },
    validate: zodResolver(createRoleSchema),
  })

  const { mutateAsync: createRole, isPending } = useCreateRole()

  const handleSubmit = async (values: typeof form.values) => {
    try {
      await createRole(values)
      notifications.show({ title: 'Success', message: 'Role successfully created', color: 'green' })
      form.reset()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <Title my={32}>Create Role</Title>

      <Container size="xs">
        <Paper withBorder p={30} mt={30} radius="md">
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
              <TextInput
                label="Name"
                placeholder="New role name"
                key={form.key('name')}
                {...form.getInputProps('name')}
              />
            </Stack>

            <Group mt="xl" justify="end">
              <Button leftSection={<IconPlus size={16} />} type="submit" disabled={isPending}>
                Create
              </Button>
            </Group>
          </form>
        </Paper>
      </Container>
    </div>
  )
}
