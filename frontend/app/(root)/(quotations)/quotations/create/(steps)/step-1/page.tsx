'use client'
import { useStepper } from '@/app/contexts/stepper'
import { Button, Group, Stack, Title } from '@mantine/core'

const mockTypes = [
  { id: 1, name: 'Hardware' },
  { id: 2, name: 'Software' },
  { id: 3, name: 'Service' },
]

export default function Step1() {
  const { incrementActive, updateData } = useStepper()

  const buttons = mockTypes.map((type) => (
    <Button
      size="xl"
      key={type.id}
      onClick={() => {
        updateData({ type: type.name })
        incrementActive()
      }}
    >
      {type.name}
    </Button>
  ))

  return (
    <Stack align="center">
      <Title>Please select the type of product</Title>
      <Group h="100%" justify="center" gap="lg" mt={100}>
        {buttons}
      </Group>
    </Stack>
  )
}
