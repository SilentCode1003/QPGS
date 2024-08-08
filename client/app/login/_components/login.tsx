'use client'
import { useLogin } from '@/api/auth/login'
import {
  Anchor,
  Button,
  Container,
  Group,
  Paper,
  PasswordInput,
  TextInput,
  Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { zodResolver } from 'mantine-form-zod-resolver'
import { useRouter, useSearchParams } from 'next/navigation'
import { LoginInput, loginSchema } from '../schema'

export default function Login() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo')

  const form = useForm<LoginInput>({
    mode: 'uncontrolled',
    initialValues: {
      username: '',
      password: '',
    },
    validate: zodResolver(loginSchema),
  })

  const { mutateAsync: login, isPending } = useLogin()

  const handleSubmit = async (values: typeof form.values) => {
    try {
      await login(values)
      router.push(redirectTo || '/dashboard')
    } catch (error) {
      form.setErrors({ username: 'Invalid credentials', password: 'Invalid credentials' })
      console.error(error)
    }
  }

  return (
    <Container size={420} my={40}>
      <Title ta="center">Welcome back!</Title>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Username"
            placeholder="Your username"
            key={form.key('username')}
            {...form.getInputProps('username')}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            mt="md"
            key={form.key('password')}
            {...form.getInputProps('password')}
          />
          <Group justify="space-between" mt="lg">
            <Anchor type="button" component="button" size="sm">
              Forgot password?
            </Anchor>
          </Group>
          <Button type="submit" fullWidth mt="xl" disabled={isPending}>
            Sign in
          </Button>
        </form>
      </Paper>
    </Container>
  )
}
