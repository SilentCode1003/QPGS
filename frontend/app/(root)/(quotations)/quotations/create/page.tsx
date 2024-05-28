import { Button, Center, Container, Stack, Title } from '@mantine/core'
import Link from 'next/link'

export default function CreateQuotation() {
  return (
    <Center maw="100vw" mih="100vh" p="xl">
      <Stack align="center" style={{ textAlign: 'center' }}>
        <Title>Welcome to quotation creator wizard</Title>
        <Button mt={96} w={200} size="xl" component={Link} href="/quotations/create/step-1">
          Continue
        </Button>
      </Stack>
    </Center>
  )
}
