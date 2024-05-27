'use client'
import StepperHeader from '@/app/components/wizard/StepperHeader'
import { StepperContextProvider } from '@/app/contexts/stepper'
import { Box } from '@mantine/core'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <StepperContextProvider>
      <div
        style={{
          display: 'grid',
          minHeight: '100vh',
          gridTemplateRows: 'auto 1fr',
        }}
      >
        <StepperHeader />

        <Box p="lg" maw="100vw" style={{ overflowX: 'auto' }}>
          {children}
        </Box>
      </div>
    </StepperContextProvider>
  )
}
