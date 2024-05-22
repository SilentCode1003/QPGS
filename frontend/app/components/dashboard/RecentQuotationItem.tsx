import { formatDate, timeFromNow } from '@/app/utils/format'
import { Badge, Card, Grid, GridCol, Text, Tooltip } from '@mantine/core'
import Link from 'next/link'

interface Props {
  quotation: {
    id: string
    status: string
    created_at: Date
  }
}

export default function RecentQuotationItem({ quotation }: Props) {
  return (
    <Card key={quotation.id} p="xs" component={Link} href={`/quotation/${quotation.id}`}>
      <Grid gutter="sm">
        <GridCol span={6}>
          <Text size="xs">{quotation.id}</Text>
        </GridCol>
        <GridCol span={6}>
          <Badge color={quotation.status === 'approved' ? 'green' : 'orange'}>
            {quotation.status}
          </Badge>
        </GridCol>
      </Grid>
      <Tooltip label={formatDate(quotation.created_at)}>
        <Text size="xs" c="dimmed">
          {timeFromNow(quotation.created_at)}
        </Text>
      </Tooltip>
    </Card>
  )
}
