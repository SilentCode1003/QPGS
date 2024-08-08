import { NumberFormatter, Text } from '@mantine/core'
import { IconArrowDownRight, IconArrowUpRight } from '@tabler/icons-react'

export default function DifferencePercentage({ change }: { change: number }) {
  const isPositive = change > 0
  const isZero = change === 0

  return (
    <Text size="sm" c={isPositive ? 'green' : isZero ? 'gray' : 'red'}>
      <NumberFormatter
        value={change}
        thousandSeparator=","
        decimalSeparator="."
        suffix="%"
        decimalScale={2}
      />
      {isPositive ? (
        <IconArrowUpRight className="inline-block" />
      ) : isZero ? null : (
        <IconArrowDownRight className="inline-block" />
      )}
    </Text>
  )
}
