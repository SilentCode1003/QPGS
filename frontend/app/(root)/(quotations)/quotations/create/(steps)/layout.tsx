'use client'
import { Button, Group, Stepper } from '@mantine/core'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState(0)

  const router = useRouter()

  const nextStep = () => {
    setActive((current) => (current < 6 ? current + 1 : current))
  }

  const prevStep = () => {
    setActive((current) => (current > 0 ? current - 1 : current))
  }

  useEffect(() => {
    router.push(`/quotations/create/step-${active + 1}`)
  }, [active, router])

  return (
    <>
      <Stepper active={active} onStepClick={setActive}>
        <Stepper.Step label="First step" description="Type selection"></Stepper.Step>
        <Stepper.Step label="Second step" description="Quotation details"></Stepper.Step>
        <Stepper.Step label="Third step" description="Client information"></Stepper.Step>
        <Stepper.Step label="Fourth step" description="Your information"></Stepper.Step>
        <Stepper.Step label="Fifth step" description="Items"></Stepper.Step>
        <Stepper.Step label="Sixth step" description="Signature"></Stepper.Step>
        <Stepper.Step label="Seventh step" description="Review"></Stepper.Step>
        <Stepper.Completed>Completed, click back button to get to previous step</Stepper.Completed>
      </Stepper>

      {children}

      <Group justify="center" mt="xl">
        <Button variant="default" onClick={prevStep}>
          Back
        </Button>
        <Button onClick={nextStep}>Next step</Button>
      </Group>
    </>
  )
}
