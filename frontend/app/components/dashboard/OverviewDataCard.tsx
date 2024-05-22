import { compactNumber } from '@/app/utils/format'
import { Card, Stack, Text, rem } from '@mantine/core'
import Link from 'next/link'

export default function OverviewDataCard({
  title,
  data,
  link,
}: {
  title: string
  data: number
  link: string
}) {
  return (
    <Card shadow="lg" p="xl" radius="lg" withBorder component={Link} href={link} h="100%">
      <Stack h="100%" justify="space-between">
        <Text c="dimmed">{title}</Text>
        <Text size={rem(32)} fw={700} truncate="end">
          {compactNumber(data)}
        </Text>
      </Stack>
    </Card>
  )
}
