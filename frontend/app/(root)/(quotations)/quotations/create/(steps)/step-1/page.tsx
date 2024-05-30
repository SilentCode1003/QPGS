'use client'
import { useStepper } from '@/app/contexts/stepper'
import { Button, Group, Stack, Title } from '@mantine/core'
import { useState } from 'react'

const mockTypes = [
  { id: 1, name: 'Hardware' },
  { id: 2, name: 'Software' },
  { id: 3, name: 'Service' },
]

export default function Step1() {
  const [clicked, setClicked] = useState(false)

  const { incrementActive, updateData } = useStepper()

  const buttons = mockTypes.map((type) => (
    <Button
      disabled={clicked}
      size="xl"
      key={type.id}
      onClick={() => {
        setClicked(true)
        updateData({ type: type.name })
        incrementActive()
      }}
    >
      {type.name}
    </Button>
  ))

  return (
    <Stack align="center">
      <Title>Please choose your product type</Title>
      <Group h="100%" justify="center" gap="lg" mt={100}>
        {buttons}
      </Group>
    </Stack>
  )
}
