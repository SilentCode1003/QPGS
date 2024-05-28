'use client'
import { useStepper } from '@/app/contexts/stepper'
import { Button, Center, Container, Group, Stack, Text, Title } from '@mantine/core'

const mockAdminUsers = [
  {
    id: 1,
    first_name: 'John',
    last_name: 'Doe',
  },
  {
    id: 2,
    first_name: 'Alice',
    last_name: 'Smith',
  },
]

export default function Step5() {
  const { incrementActive } = useStepper()

  const list = mockAdminUsers.map((user) => (
    <Group key={user.id}>{`${user.first_name} ${user.last_name}`}</Group>
  ))

  return (
    <Container size="sm">
      <Center>
        <Title>Signatory</Title>
      </Center>

      <Stack gap="xl" mt={50}>
        <Text size="lg">Here are the list of possible people to approve your quotation</Text>

        {list}

        <Button onClick={incrementActive}>Next</Button>
      </Stack>
    </Container>
  )
}
