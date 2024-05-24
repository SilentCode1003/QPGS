'use client'
import { useLocalStorage } from '@mantine/hooks'
import { useRouter } from 'next/navigation'
import { Dispatch, SetStateAction, createContext, useContext, useEffect, useState } from 'react'
import { Step2Values } from '../(root)/(quotations)/quotations/create/(steps)/step-2/page'
import { Step3Values } from '../(root)/(quotations)/quotations/create/(steps)/step-3/page'
import { Step4Values } from '../(root)/(quotations)/quotations/create/(steps)/step-4/page'
import { Step5Values } from '../(root)/(quotations)/quotations/create/(steps)/step-5/page'

type Values = {
  type: string
} & Step2Values &
  Step3Values &
  Step4Values &
  Step5Values

type Ctx = {
  active: number
  setActive: Dispatch<SetStateAction<number>>
  incrementActive: () => void
  decrementActive: () => void
  handleStepChange: (nextStep: number) => void
  shouldAllowSelectStep: (step: number) => boolean
  data: Partial<Values>
  updateData: (values: Partial<Values>) => void
  removeData: () => void
}

export const StepperContext = createContext<Ctx>({} as Ctx)

export const useStepper = () => {
  const context = useContext(StepperContext)
  return context
}

const MAX_STEPS = 7
export const LOCAL_STORAGE_KEY = 'quotation-system-progress'

export const StepperContextProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()

  const [active, setActive] = useLocalStorage<number>({ key: 'qs-active', defaultValue: 0 })

  const [data, setData, removeData] = useLocalStorage<Partial<Values>>({ key: LOCAL_STORAGE_KEY })

  const [highestStepVisited, setHighestStepVisited] = useLocalStorage({
    key: 'qs-highest',
    defaultValue: active,
  })

  const handleStepChange = (nextStep: number) => {
    const isOutOfBounds = nextStep > MAX_STEPS - 1 || nextStep < 0

    if (isOutOfBounds) {
      return
    }

    setActive(nextStep)
    setHighestStepVisited((hSC) => Math.max(hSC, nextStep))
  }

  // Allow the user to freely go back and forth between visited steps.
  const shouldAllowSelectStep = (step: number) => highestStepVisited >= step && active !== step

  const incrementActive = () => {
    // setActive((current) => (current < 7 ? current + 1 : current))
    handleStepChange(active + 1)
  }

  const decrementActive = () => {
    // setActive((current) => (current > 0 ? current - 1 : current))
    handleStepChange(active - 1)
  }

  const updateData = (values: Partial<Values>) => {
    setData((prev) => ({ ...prev, ...values }))
  }

  useEffect(() => {
    console.log('data', data)
  }, [data])

  useEffect(() => {
    router.push(`/quotations/create/step-${active + 1}`)
  }, [active, router])

  return (
    <StepperContext.Provider
      value={{
        active,
        setActive,
        incrementActive,
        decrementActive,
        handleStepChange,
        shouldAllowSelectStep,
        data,
        updateData,
        removeData,
      }}
    >
      {children}
    </StepperContext.Provider>
  )
}
