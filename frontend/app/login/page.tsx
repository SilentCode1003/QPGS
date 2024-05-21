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
import { z } from 'zod'
import { useLogin } from '../lib/auth'

const schema = z.object({
  username: z.string().min(3),
  password: z.string().min(3),
})

export default function Login() {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      username: '',
      password: '',
    },
    validate: zodResolver(schema),
  })

  const login = useLogin()

  const onSubmit = async (values: typeof form.values) => {
    const user = await login.mutateAsync(values)
    console.log(user)
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
          <Button type="submit" fullWidth mt="xl">
            Sign in
          </Button>
        </form>
      </Paper>
    </Container>
  )
}
