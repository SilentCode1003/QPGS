import { Box, Card, Text } from '@mantine/core'

export default function DashboardCard({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <Card shadow="xs" p="xl" radius="lg">
      <Text size="lg" fw={500}>
        {title}
      </Text>
      <Box mt="sm">{children}</Box>
    </Card>
  )
}
