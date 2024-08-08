'use client'

import { Stepper } from '@mantine/core'
import { useLocalStorage } from '@mantine/hooks'
import Review from './_components/Review'
import Step1, {
  QS_STEP_NUMBER_LOCAL_STORAGE_KEY,
  STEP1_LOCAL_STORAGE_KEY,
} from './_components/Step1'
import Step2, { STEP2_LOCAL_STORAGE_KEY } from './_components/Step2'
import Step3, { STEP3_LOCAL_STORAGE_KEY } from './_components/Step3'
import Step4, { STEP4_LOCAL_STORAGE_KEY } from './_components/Step4'

const getLocalStorageItem = (key: string) =>
  window.localStorage.getItem(key) && JSON.parse(window.localStorage.getItem(key)!)

export default function CreateQuotationPage() {
  const [active, setActive] = useLocalStorage({
    key: QS_STEP_NUMBER_LOCAL_STORAGE_KEY,
    defaultValue: 0,
  })

  const nextStep = () => {
    setActive(active + 1)
  }
  const prevStep = () => {
    setActive(active - 1)
  }

  const payload = {
    ...getLocalStorageItem(STEP1_LOCAL_STORAGE_KEY),
    ...getLocalStorageItem(STEP2_LOCAL_STORAGE_KEY),
    ...getLocalStorageItem(STEP3_LOCAL_STORAGE_KEY),
    ...getLocalStorageItem(STEP4_LOCAL_STORAGE_KEY),
  }

  return (
    <div className="p-8">
      <Stepper active={active}>
        <Stepper.Step label="First Step">
          <Step1 nextStep={nextStep} prevStep={prevStep} />
        </Stepper.Step>

        <Stepper.Step label="Second Step">
          <Step2 nextStep={nextStep} prevStep={prevStep} />
        </Stepper.Step>

        <Stepper.Step label="Third Step">
          <Step3 nextStep={nextStep} prevStep={prevStep} />
        </Stepper.Step>

        <Stepper.Step label="Fourth Step">
          <Step4 nextStep={nextStep} prevStep={prevStep} />
        </Stepper.Step>

        <Stepper.Completed>
          <Review prevStep={prevStep} payload={payload} />
        </Stepper.Completed>
      </Stepper>
    </div>
  )
}
