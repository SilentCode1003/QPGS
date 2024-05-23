'use client'
import { Box, Button, Flex, Grid, GridCol, Group, Stack, Stepper } from '@mantine/core'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState(0)

  const router = useRouter()

  const nextStep = () => {
    setActive((current) => (current < 7 ? current + 1 : current))
  }

  const prevStep = () => {
    setActive((current) => (current > 0 ? current - 1 : current))
  }

  useEffect(() => {
    if (active < 7) {
      const link = `/quotations/create/step-${active + 1}`
      router.push(link)
    } else {
      router.push('/dashboard')
    }
  }, [active, router])

  return (
    <div
      style={{
        display: 'grid',
        minHeight: '100vh',
        gridTemplateRows: 'auto 1fr auto',
      }}
    >
      <Stepper active={active} onStepClick={setActive} p="sm" size="xs">
        <Stepper.Step label="First step" description="Type selection"></Stepper.Step>
        <Stepper.Step label="Second step" description="Quotation details"></Stepper.Step>
        <Stepper.Step label="Third step" description="Client information"></Stepper.Step>
        <Stepper.Step label="Fourth step" description="Your information"></Stepper.Step>
        <Stepper.Step label="Fifth step" description="Items"></Stepper.Step>
        <Stepper.Step label="Sixth step" description="Signature"></Stepper.Step>
        <Stepper.Step label="Seventh step" description="Review"></Stepper.Step>
        <Stepper.Completed>Completed, click back button to get to previous step</Stepper.Completed>
      </Stepper>

      <Box p="lg" maw="100vw" style={{ overflowX: 'auto' }}>
        {children}
      </Box>

      <Group justify="center" p="sm">
        <Button variant="default" onClick={prevStep}>
          Back
        </Button>
        <Button onClick={nextStep}>Next step</Button>
      </Group>
    </div>
  )
}
