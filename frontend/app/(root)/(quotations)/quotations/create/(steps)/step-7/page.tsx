'use client'
import { useStepper } from '@/app/contexts/stepper'
import { Button, Skeleton } from '@mantine/core'
import { useRouter } from 'next/navigation'

export default function Step7() {
  const router = useRouter()

  const { removeData } = useStepper()

  return (
    <div>
      <Skeleton h={11 * 80} w={8.5 * 80} animate={false} />
      <Button
        onClick={() => {
          router.push('/dashboard')
          removeData()
        }}
      >
        Next
      </Button>
    </div>
  )
}
