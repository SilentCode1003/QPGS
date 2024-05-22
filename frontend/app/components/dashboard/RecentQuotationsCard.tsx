import { Button, Stack } from '@mantine/core'
import DashboardCard from './DashboardCard'
import RecentQuotationItem from './RecentQuotationItem'

const mockData = {
  pendingQuotations: 3,
  expiredQuotations: 13,
  recentQuotations: [
    {
      id: '103-204-0003',
      totalAmount: '8997.00',
      username: 'john',
      first_name: 'john',
      status: 'approved',
      created_at: new Date(),
    },
    {
      id: '103-204-0002',
      totalAmount: '10997.00',
      username: 'alice',
      first_name: 'alice',
      status: 'pending',
      created_at: new Date('2024-05-20T03:30:38.608Z'),
    },
    {
      id: '103-204-0001',
      totalAmount: '208997.85',
      username: 'jane',
      first_name: 'jane',
      status: 'approved',
      created_at: new Date('2024-05-20T03:30:38.608Z'),
    },
  ],
}

export default function RecentQuotationsCard() {
  return (
    <DashboardCard title="Recent quotations">
      <Stack gap="sm">
        {mockData.recentQuotations.map((quotation) => (
          <RecentQuotationItem key={quotation.id} quotation={quotation} />
        ))}

        <Button variant="default" component="a" href="#">
          View all
        </Button>
      </Stack>
    </DashboardCard>
  )
}
