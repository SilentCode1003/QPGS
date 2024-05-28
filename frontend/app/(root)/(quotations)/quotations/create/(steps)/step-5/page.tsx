'use client'
import { useStepper } from '@/app/contexts/stepper'
import { Button } from '@mantine/core'

export default function Step5() {
  const { incrementActive } = useStepper()

  return (
    <div>
      Step 5<Button onClick={incrementActive}>Next</Button>
    </div>
  )
}
