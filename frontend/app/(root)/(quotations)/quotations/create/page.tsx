import { Button, Title } from '@mantine/core'
import Link from 'next/link'

export default function CreateQuotation() {
  return (
    <div>
      <Title>Welcome to quotation creator wizard</Title>
      <Button component={Link} href="/quotations/create/step-1">
        Start
      </Button>
    </div>
  )
}
