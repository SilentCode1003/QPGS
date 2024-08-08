import { Badge } from '@mantine/core'

export default function QuotationStatusBadge({ status }: { status: string }) {
  let color = ''
  switch (status) {
    case 'pending':
      color = 'blue'
      break
    case 'approved':
      color = 'green'
      break
    default:
      color = 'blue'
      break
  }

  return <Badge color={color}>{status}</Badge>
}
