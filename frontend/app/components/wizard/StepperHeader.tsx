import { useStepper } from '@/app/contexts/stepper'
import { Stepper } from '@mantine/core'

export default function StepperHeader() {
  const { active, setActive, shouldAllowSelectStep } = useStepper()

  return (
    <Stepper active={active} onStepClick={setActive} p="sm" size="xs">
      <Stepper.Step
        label="Type Selection"
        allowStepSelect={shouldAllowSelectStep(0)}
      ></Stepper.Step>
      <Stepper.Step
        label="Quotation details"
        allowStepSelect={shouldAllowSelectStep(1)}
      ></Stepper.Step>
      <Stepper.Step
        label="Client information"
        allowStepSelect={shouldAllowSelectStep(2)}
      ></Stepper.Step>
      <Stepper.Step label="Items" allowStepSelect={shouldAllowSelectStep(3)}></Stepper.Step>
      <Stepper.Step label="Signatory" allowStepSelect={shouldAllowSelectStep(4)}></Stepper.Step>
      <Stepper.Step label="Review" allowStepSelect={shouldAllowSelectStep(5)}></Stepper.Step>
      <Stepper.Completed>Completed, click back button to get to previous step</Stepper.Completed>
    </Stepper>
  )
}
