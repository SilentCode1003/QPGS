'use client'
import { useStepper } from '@/app/contexts/stepper'
import { Button, Skeleton } from '@mantine/core'
import { useRouter } from 'next/navigation'

export default function Step7() {
  const router = useRouter()

  const { data, removeData } = useStepper()

  return (
    <div>
      <Skeleton h={11 * 80} w={8.5 * 80} animate={false} />
      <Button
        onClick={() => {
          // router.push('/dashboard')
          console.log(data)
          // removeData()
        }}
      >
        Submit
      </Button>
    </div>
  )
}
