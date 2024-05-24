import { useStepper } from '@/app/contexts/stepper'
import { Button } from '@mantine/core'

export default function Step6() {
  const { incrementActive } = useStepper()

  return (
    <div>
      Step 6<Button onClick={incrementActive}>Next</Button>
    </div>
  )
}
