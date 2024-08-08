'use client'

import { useGetAllRoles } from '@/api/roles/all'
import { useCreateUser } from '@/api/users/create'
import { toBase64 } from '@/utils/file'
import {
  Button,
  Container,
  FileInput,
  Group,
  NativeSelect,
  Paper,
  PasswordInput,
  Stack,
  TextInput,
  Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { IconImageInPicture, IconPlus } from '@tabler/icons-react'
import { zodResolver } from 'mantine-form-zod-resolver'
import { CreateUserInput, createUserSchema } from './schema'

const defaultRoles = [{ label: '', value: '' }]

export default function CreateUser() {
  const form = useForm<CreateUserInput>({
    mode: 'uncontrolled',
    initialValues: {
      first_name: '',
      last_name: '',
      email: '',
      username: '',
      password: '',
      role_id: '',
      job_title: '',
      signature: null,
    },
    validate: zodResolver(createUserSchema),
  })

  const { data: roles, isLoading: rolesIsLoading } = useGetAllRoles()
  const transformedRoles = roles?.data.map((role) => ({
    label: role.name,
    value: role.id.toString(),
  }))

  const { mutateAsync: createUser, isPending } = useCreateUser()

  const handleSubmit = async (values: typeof form.values) => {
    let convertedSignature: string | ArrayBuffer | null = null

    // If signature is not falsy, convert to base64
    if (values.signature) {
      try {
        convertedSignature = await toBase64(values.signature)
      } catch (error) {
        console.error(error)
        notifications.show({
          title: 'Error',
          message: 'Cannot convert image to base64',
          color: 'red',
        })
        return
      }
    }

    // If some reason the converted signature is an ArrayBuffer, return early
    if (convertedSignature instanceof ArrayBuffer) {
      console.error('Image is converted into an ArrayBuffer')
      notifications.show({
        title: 'Error',
        message: 'Cannot convert image to base64',
        color: 'red',
      })
      return
    }

    // Needed for payload
    let transformedValues = {
      ...values,
      role_id: Number(values.role_id),
      signature: convertedSignature,
    }

    try {
      await createUser(transformedValues)
      notifications.show({
        title: 'Success',
        message: 'User successfully created',
        color: 'green',
      })
      form.reset()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <Title my={32}>Create User</Title>

      <Container size="xs">
        <Paper withBorder p={30} mt={30} radius="md">
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
              <TextInput
                label="First Name"
                placeholder="First Name"
                key={form.key('first_name')}
                {...form.getInputProps('first_name')}
              />

              <TextInput
                label="Last Name"
                placeholder="Last Name"
                key={form.key('last_name')}
                {...form.getInputProps('last_name')}
              />

              <TextInput
                label="Email"
                placeholder="Email"
                key={form.key('email')}
                {...form.getInputProps('email')}
              />

              <TextInput
                label="Username"
                placeholder="Username"
                key={form.key('username')}
                {...form.getInputProps('username')}
              />

              <PasswordInput
                label="Password"
                placeholder="Password"
                key={form.key('password')}
                {...form.getInputProps('password')}
              />

              <NativeSelect
                label="Role"
                data={transformedRoles ? defaultRoles.concat(transformedRoles) : defaultRoles}
                key={form.key('role_id')}
                {...form.getInputProps('role_id')}
              />

              <TextInput
                label="Job Title"
                placeholder="Job Title"
                key={form.key('job_title')}
                {...form.getInputProps('job_title')}
              />

              <FileInput
                clearable
                leftSection={<IconImageInPicture />}
                label="Signature (Optional)"
                placeholder="Signature"
                key={form.key('signature')}
                {...form.getInputProps('signature')}
              />
            </Stack>

            <Group mt="xl" justify="end">
              <Button
                leftSection={<IconPlus size={16} stroke={1.5} />}
                type="submit"
                disabled={isPending}
              >
                Create
              </Button>
            </Group>
          </form>
        </Paper>
      </Container>
    </div>
  )
}
