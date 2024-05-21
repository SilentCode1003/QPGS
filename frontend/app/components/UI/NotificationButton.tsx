import { ActionIcon } from '@mantine/core'
import { IconBell } from '@tabler/icons-react'

export default function NotificationButton({
  actionSize,
  iconSize,
}: {
  actionSize: number
  iconSize: number
}) {
  return (
    <ActionIcon size={actionSize} variant="default">
      <IconBell size={iconSize} stroke={1.5} />
    </ActionIcon>
  )
}
