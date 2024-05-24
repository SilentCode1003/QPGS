import { useStepper } from '@/app/contexts/stepper'
import { Stepper } from '@mantine/core'

export default function StepperHeader() {
  const { active, setActive, shouldAllowSelectStep } = useStepper()

  return (
    <Stepper active={active} onStepClick={setActive} p="sm" size="xs">
      <Stepper.Step
        label="First step"
        description="Type selection"
        allowStepSelect={shouldAllowSelectStep(0)}
      ></Stepper.Step>
      <Stepper.Step
        label="Second step"
        description="Quotation details"
        allowStepSelect={shouldAllowSelectStep(1)}
      ></Stepper.Step>
      <Stepper.Step
        label="Third step"
        description="Client information"
        allowStepSelect={shouldAllowSelectStep(2)}
      ></Stepper.Step>
      <Stepper.Step
        label="Fourth step"
        description="Your information"
        allowStepSelect={shouldAllowSelectStep(3)}
      ></Stepper.Step>
      <Stepper.Step
        label="Fifth step"
        description="Items"
        allowStepSelect={shouldAllowSelectStep(4)}
      ></Stepper.Step>
      <Stepper.Step
        label="Sixth step"
        description="Signature"
        allowStepSelect={shouldAllowSelectStep(5)}
      ></Stepper.Step>
      <Stepper.Step
        label="Seventh step"
        description="Review"
        allowStepSelect={shouldAllowSelectStep(6)}
      ></Stepper.Step>
      <Stepper.Completed>Completed, click back button to get to previous step</Stepper.Completed>
    </Stepper>
  )
}
