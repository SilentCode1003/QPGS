import { useGetCurrentApprovedTotalAmount } from '@/api/dashboard/current-approved-amount'
import { Badge, Flex, NumberFormatter, SimpleGrid, Skeleton, Text } from '@mantine/core'
import CardLayout from '../CardLayout'
import DifferencePercentage from './DifferencePercentage'

export default function CurrentApprovedTotal() {
  const { data, isLoading, isError } = useGetCurrentApprovedTotalAmount()

  return (
    <CardLayout>
      <SimpleGrid cols={2} spacing="xs">
        <Text size="sm" c="dimmed" className="uppercase">
          Approved Total Amount
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
              <NumberFormatter
                value={data?.data.currentMonthTotalAmount}
                thousandSeparator=","
                decimalSeparator="."
                prefix="₱"
                decimalScale={2}
              />
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
