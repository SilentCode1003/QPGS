'use client'

import { Button, Flex, Stack, Text } from '@mantine/core'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  return (
    <Flex h="100vh" justify="center" align="center" p="lg">
      <Stack p={30}>
        {/* <Image src="/FiveL-1.png" alt="5L Solutions logo" width={500} height={500} /> */}

        <Text c="blue" size="128px" fw="bold">
          QPGS
        </Text>
        <Text size="36px">Quotation and Purchase Order Generator System</Text>

        <div className="mt-20">
          <Button
            size="xl"
            onClick={() => {
              router.push('/login')
            }}
          >
            Go to login page
          </Button>
        </div>
      </Stack>
    </Flex>
  )
}
