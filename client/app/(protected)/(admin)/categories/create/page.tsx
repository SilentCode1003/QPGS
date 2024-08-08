'use client'

import { useCreateCategory } from '@/api/categories/create'
import { Button, Container, Group, Paper, Stack, TextInput, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { IconPlus } from '@tabler/icons-react'
import { zodResolver } from 'mantine-form-zod-resolver'
import { CreateCategoryInput, createCategorySchema } from './schema'

export default function CreateCategory() {
  const form = useForm<CreateCategoryInput>({
    mode: 'uncontrolled',
    initialValues: {
      name: '',
    },
    validate: zodResolver(createCategorySchema),
  })

  const { mutateAsync: createCategory, isPending } = useCreateCategory()

  const handleSubmit = async (values: typeof form.values) => {
    try {
      await createCategory(values)
      notifications.show({
        title: 'Success',
        message: 'Category successfully created',
        color: 'green',
      })
      form.reset()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <Title my={32}>Create Category</Title>

      <Container size="xs">
        <Paper withBorder p={30} mt={30} radius="md">
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
              <TextInput
                label="Name"
                placeholder="New category name"
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
