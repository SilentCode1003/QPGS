'use client'

import { useChangePassword } from '@/api/users/change-password'
import { Button, Container, Group, Paper, PasswordInput, Stack, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { zodResolver } from 'mantine-form-zod-resolver'
import { changePasswordSchema, UpdateUserInput } from './schema'

export default function SettingsPage() {
  const form = useForm<UpdateUserInput>({
    mode: 'uncontrolled',
    initialValues: {
      password: '',
    },
    validate: zodResolver(changePasswordSchema),
  })

  const { mutateAsync: changePassword, isPending } = useChangePassword()

  const handleSubmit = async (values: typeof form.values) => {
    try {
      await changePassword(values)
      notifications.show({
        title: 'Success',
        message: 'Password successfully changed',
        color: 'green',
      })
      form.reset()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <Title my={32}>Account Settings</Title>

      <Container size="xs">
        <Paper withBorder p={30} mt={30} radius="md">
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
              <PasswordInput
                label="Change Password"
                placeholder="Please enter your new password"
                key={form.key('password')}
                {...form.getInputProps('password')}
              />
            </Stack>
            <Group mt="xl" justify="end">
              <Button type="submit" disabled={isPending}>
                Submit
              </Button>
            </Group>
          </form>
        </Paper>
      </Container>
    </div>
  )
}
