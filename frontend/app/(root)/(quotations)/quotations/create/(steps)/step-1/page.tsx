'use client'
import { useStepper } from '@/app/contexts/stepper'
import { Button, Group } from '@mantine/core'

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
    <Group h="100%" justify="center" gap="lg">
      {buttons}
    </Group>
  )
}
