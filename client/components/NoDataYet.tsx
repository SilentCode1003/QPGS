import { Stack, Text } from '@mantine/core'
import { IconMoodEmpty } from '@tabler/icons-react'

export default function NoDataYet({ resourceName }: { resourceName: string }) {
  return (
    <Stack align="center" mt={60}>
      <IconMoodEmpty size={120} color="gray" />
      <Text c="gray" size="lg" fw={700}>
        No {resourceName} yet...
      </Text>
    </Stack>
  )
}
