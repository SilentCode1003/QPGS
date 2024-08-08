'use client'

import { useGetQuotationsPerMonth } from '@/api/dashboard/quotations-per-month'
import { LineChart } from '@mantine/charts'
import { Skeleton, Text } from '@mantine/core'
import CardLayout from './CardLayout'

export default function QuotationsPerMonth() {
  const { data, isLoading, isError } = useGetQuotationsPerMonth()

  return (
    <CardLayout>
      <Text size="lg" fw={700} mb="lg">
        Number of quotations per month
      </Text>

      {isLoading ? (
        <Skeleton h={330} />
      ) : data?.data.length === 0 ? (
        <Text>No data</Text>
      ) : (
        !isError && (
          <LineChart
            h={300}
            data={data?.data || []}
            dataKey="date"
            series={[{ name: 'count', color: 'indigo.6' }]}
            curveType="linear"
          />
        )
      )}
    </CardLayout>
  )
}
