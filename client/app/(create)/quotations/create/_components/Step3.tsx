import { useGetAllClients } from '@/api/clients/all'
import { Button, Container, Group, Modal, Paper, Select, Skeleton, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { zodResolver } from 'mantine-form-zod-resolver'
import { useEffect } from 'react'
import { z } from 'zod'
import CreateClient from './CreateClient'

export const STEP3_LOCAL_STORAGE_KEY = 'qs-step-3' as const

const step3Schema = z.object({
  client_id: z.string().trim().min(1, { message: 'Client Id is required' }),
})

type Step3Input = z.infer<typeof step3Schema>

export default function Step3({
  nextStep,
  prevStep,
}: {
  nextStep: () => void
  prevStep: () => void
}) {
  const form = useForm<Step3Input>({
    mode: 'uncontrolled',
    initialValues: {
      client_id: '',
    },
    onValuesChange: (values) => {
      window.localStorage.setItem(STEP3_LOCAL_STORAGE_KEY, JSON.stringify(values))
    },
    validate: zodResolver(step3Schema),
  })

  const { data: clients, isLoading: clientsIsLoading } = useGetAllClients({ is_active: 'true' })
  const clientsSelectData = clients?.data.map((client) => ({
    label: client.name,
    value: client.id.toString(),
  }))

  const [opened, { open, close }] = useDisclosure(false)

  const handleSubmit = () => {
    nextStep()
  }

  useEffect(() => {
    const storedValue = window.localStorage.getItem(STEP3_LOCAL_STORAGE_KEY)

    if (storedValue) {
      try {
        form.setValues(JSON.parse(window.localStorage.getItem(STEP3_LOCAL_STORAGE_KEY)!))
      } catch (error) {
        notifications.show({
          title: 'Error',
          message: 'Failed to parse stored value',
          color: 'red',
        })
      }
    }
  }, [])

  return (
    <>
      <Modal opened={opened} onClose={close} title="Create new client" centered>
        <CreateClient />
      </Modal>

      <div>
        <Container size="xs">
          <Paper withBorder p={30} mt={30} radius="md">
            <Title mb={36}>Client Details</Title>

            <form onSubmit={form.onSubmit(handleSubmit)}>
              {clientsIsLoading ? (
                <Skeleton h={28} />
              ) : (
                <Select
                  label="Client"
                  placeholder="Select a client"
                  searchable
                  withScrollArea={false}
                  styles={{ dropdown: { maxHeight: 200, overflowY: 'auto' } }}
                  data={clientsSelectData || []}
                  key={form.key('client_id')}
                  {...form.getInputProps('client_id')}
                />
              )}

              <Group mt={24} justify="end">
                <Button type="button" onClick={prevStep} variant="default">
                  Back
                </Button>
                <Button type="submit">Next</Button>
              </Group>
            </form>
          </Paper>

          <Group justify="center" mt={48}>
            <Button variant="default" size="lg" onClick={open}>
              Or create a new client
            </Button>
          </Group>
        </Container>
      </div>
    </>
  )
}
