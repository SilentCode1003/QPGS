'use client'
import { useStepper } from '@/app/contexts/stepper'
import { Button, Center, Container, ScrollArea, Skeleton, Stack, Title } from '@mantine/core'
import { useRouter } from 'next/navigation'

export default function Step7() {
  const router = useRouter()

  const { data, removeData } = useStepper()

  return (
    <Container size="sm">
      <Center>
        <Title>Review your quotation</Title>
      </Center>

      <Stack gap="lg" mt={50}>
        <ScrollArea>
          <Skeleton h={11 * 80} w={8.5 * 80} animate={false} />
        </ScrollArea>
        <Button
          onClick={() => {
            // router.push('/dashboard')
            console.log(data)
            // removeData()
          }}
        >
          Submit
        </Button>
      </Stack>
    </Container>
  )
}
