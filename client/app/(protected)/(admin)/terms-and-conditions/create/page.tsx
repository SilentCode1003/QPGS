'use client'

import { useCreateTermsAndConditions } from '@/api/terms-and-conditions/create'
import { Button, Container, Group, Paper, Stack, Textarea, TextInput, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { IconPlus } from '@tabler/icons-react'
import { zodResolver } from 'mantine-form-zod-resolver'
import { CreateTermsAndConditionsInput, createTermsAndConditionsSchema } from './schema'

export default function CreateTermsAndConditions() {
  const form = useForm<CreateTermsAndConditionsInput>({
    mode: 'uncontrolled',
    initialValues: {
      body: '',
      summary: '',
    },
    validate: zodResolver(createTermsAndConditionsSchema),
  })

  const { mutateAsync: createTermsAndConditions, isPending } = useCreateTermsAndConditions()

  const handleSubmit = async (values: typeof form.values) => {
    try {
      await createTermsAndConditions(values)
      notifications.show({
        title: 'Success',
        message: 'Preset successfully created',
        color: 'green',
      })
      form.reset()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <Title my={32}>Create Terms and Conditions Preset</Title>

      <Container size="xs">
        <Paper withBorder p={30} mt={30} radius="md">
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
              <TextInput
                label="Summary"
                placeholder="Summary"
                key={form.key('summary')}
                {...form.getInputProps('summary')}
              />

              <Textarea
                autosize
                label="Body"
                placeholder="Body"
                key={form.key('body')}
                {...form.getInputProps('body')}
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
