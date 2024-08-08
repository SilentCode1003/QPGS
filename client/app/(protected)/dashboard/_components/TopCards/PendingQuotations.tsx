import { useGetPendingQuotationsCount } from '@/api/dashboard/pending-quotations'
import { Badge, Indicator, SimpleGrid, Skeleton, Text } from '@mantine/core'
import CardLayout from '../CardLayout'
import Link from 'next/link'

export default function PendingQuotations() {
  const { data, isLoading, isError } = useGetPendingQuotationsCount()

  return (
    <Link href="/quotations/pending">
      <CardLayout>
        <SimpleGrid cols={2} spacing="xs">
          <Text size="sm" c="dimmed" className="uppercase">
            Pending Quotations
          </Text>

          <Badge ml="auto">Today</Badge>
        </SimpleGrid>
        {isLoading ? (
          <Skeleton h={28} />
        ) : isError ? (
          <Text>Error</Text>
        ) : (
          <div className="mt-4">
            <Indicator inline processing color="red" disabled={data?.data === 0}>
              <Text size="xl" fw={500}>
                {data?.data}
              </Text>
            </Indicator>
          </div>
        )}
      </CardLayout>
    </Link>
  )
}
