'use client'
import {
  Box,
  Button,
  Paper,
  PasswordInput,
  Stack,
  TextInput,
  Title,
} from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { z } from 'zod'
import { useLogin } from './api/login'
import classes from './login.module.css'

const schema = z.object({
  username: z.string().trim().min(1, { message: 'Username is required' }),
  password: z.string().min(1, { message: 'Password is required' }),
})

type FormSchemaType = z.infer<typeof schema>

export default function LoginPage() {
  const form = useForm<FormSchemaType>({
    mode: 'uncontrolled',
    initialValues: {
      username: '',
      password: '',
    },
    validate: zodResolver(schema),
  })

  const loginMutation = useLogin()

  const handleSubmit = async (values: FormSchemaType) => {
    loginMutation.mutate(values)
  }

  return (
    <div className={classes['login__wrapper']}>
      <Box className={classes['login__container']}>
        <Title ta="center">Welcome back!</Title>

        <Paper withBorder p="xl" mt="xl" shadow="md" radius="lg">
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
              <TextInput
                withAsterisk
                label="Username"
                placeholder="your@email.com"
                key={form.key('username')}
                {...form.getInputProps('username')}
              />
              <PasswordInput
                withAsterisk
                label="Password"
                placeholder="Your password"
                key={form.key('password')}
                {...form.getInputProps('password')}
              />
              <Button type="submit" disabled={loginMutation.isPending}>
                Login
              </Button>
            </Stack>
          </form>
        </Paper>
      </Box>
    </div>
  )
}
