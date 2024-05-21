'use client'
import {
  Anchor,
  Button,
  Checkbox,
  Container,
  Group,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { z } from 'zod'
import { useLogin } from '../lib/auth'

const schema = z.object({
  username: z.string().min(3),
  password: z.string().min(3),
})

export default function Login({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined }
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const redirectTo = searchParams.redirectTo

  const login = useLogin()

  const router = useRouter()

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      username: '',
      password: '',
    },
    validate: zodResolver(schema),
  })

  const onSubmit = async (values: typeof form.values) => {
    setIsSubmitting(true)
    try {
      await login.mutateAsync(values)
      notifications.show({
        title: 'Success',
        message: 'Login successful',
        color: 'green',
      })
      setIsSubmitting(false)
      router.replace(redirectTo ? redirectTo : '/')
    } catch (err) {
      // No need to show the error notifications because it is handled by the axios interceptor
      setIsSubmitting(false)
    }
  }

  return (
    <Container size={420} my={40}>
      <Title ta="center">Welcome back!</Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Do not have an account yet?{' '}
        <Anchor size="sm" component="button">
          Create account
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit(onSubmit)}>
          <TextInput
            withAsterisk
            label="Username"
            placeholder="Your username"
            key={form.key('username')}
            {...form.getInputProps('username')}
          />
          <PasswordInput
            withAsterisk
            label="Password"
            placeholder="Your password"
            key={form.key('password')}
            mt="md"
            {...form.getInputProps('password')}
          />
          <Group justify="space-between" mt="lg">
            <Checkbox label="Remember me" />
            <Anchor size="sm">Forgot password?</Anchor>
          </Group>
          <Button type="submit" fullWidth mt="xl" disabled={isSubmitting}>
            Sign in
          </Button>
        </form>
      </Paper>
    </Container>
  )
}
