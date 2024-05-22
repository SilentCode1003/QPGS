import { compactNumber } from '@/app/utils/format'
import { Card, Stack, Text, rem } from '@mantine/core'

export default function OverviewDataCard({ title, data }: { title: string; data: number }) {
  return (
    <Card shadow="lg" p="xl" radius="lg" withBorder component="a" href="#" h="100%">
      <Stack h="100%" justify="space-between">
        <Text c="dimmed">{title}</Text>
        <Text size={rem(32)} fw={700} truncate="end">
          {compactNumber(data)}
        </Text>
      </Stack>
    </Card>
  )
}
