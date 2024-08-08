'use client'

import { useGetMostQuotedProducts } from '@/api/dashboard/most-quoted-products'
import { PieChart } from '@mantine/charts'
import { Group, Skeleton, Text } from '@mantine/core'
import CardLayout from './CardLayout'

// https://yeun.github.io/open-color/
const colors = [
  'blue',
  'indigo',
  'violet',
  'cyan',
  'green',
  'pink',
  'teal',
  'lime',
  'orange',
  'red',
  'grape',
  'yellow',
  'gray',
]

export default function MostQuotedProducts() {
  const { data, isLoading, isError } = useGetMostQuotedProducts()
  const pieChartData = data?.data.map((val, index) => ({
    ...val,
    color: colors[index % colors.length],
  }))

  return (
    <CardLayout>
      <Text size="lg" fw={700} mb="lg">
        Most quoted products
      </Text>

      <Group justify="center">
        {isLoading ? (
          <Skeleton h={330} />
        ) : data?.data.length === 0 ? (
          <Text>No data</Text>
        ) : (
          !isError && (
            <PieChart data={pieChartData!} size={250} withLabels withLabelsLine withTooltip />
          )
        )}
      </Group>
    </CardLayout>
  )
}
