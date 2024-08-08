import { useGetCurrentApprovedCount } from '@/api/dashboard/current-approved-quotations'
import { Badge, Flex, SimpleGrid, Skeleton, Text } from '@mantine/core'
import CardLayout from '../CardLayout'
import DifferencePercentage from './DifferencePercentage'

export default function CurrentApprovedCount() {
  const { data, isLoading, isError } = useGetCurrentApprovedCount()

  return (
    <CardLayout>
      <SimpleGrid cols={2} spacing="xs">
        <Text size="sm" c="dimmed" className="uppercase">
          Approved Quotations
        </Text>

        <Badge ml="auto">Monthly</Badge>
      </SimpleGrid>
      {isLoading ? (
        <Skeleton h={28} />
      ) : isError ? (
        <Text>Error</Text>
      ) : (
        <>
          <Flex mt="md" align="end" gap="md">
            <Text size="xl" fw={500}>
              {data?.data.currentMonthTotalCount}
            </Text>

            <DifferencePercentage change={data?.data.changePercent || 0} />
          </Flex>
          <Text size="xs" c="dimmed">
            Compared to previous month
          </Text>
        </>
      )}
    </CardLayout>
  )
}
