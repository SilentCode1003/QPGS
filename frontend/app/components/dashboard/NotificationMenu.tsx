import { timeFromNow } from '@/app/utils/format'
import { ActionIcon, Badge, Divider, Menu, Stack, Text } from '@mantine/core'
import { IconBell } from '@tabler/icons-react'
import Link from 'next/link'

interface Notification {
  id: number
  content: string
  link: string
  date: Date
  status: 'read' | 'unread'
}

const mockNotifications: Notification[] = [
  {
    id: 1,
    content: 'A new quotation is awaiting for approval',
    link: '/quotation/103-2024-001',
    date: new Date(),
    status: 'unread',
  },
  {
    id: 2,
    content: 'A new quotation is awaiting for approval',
    link: '/quotation/103-2024-001',
    date: new Date(),
    status: 'unread',
  },
]

export default function NotificationMenu() {
  const notifications = !mockNotifications.length ? (
    <Menu.Item component="span" disabled>
      No new notifications
    </Menu.Item>
  ) : (
    mockNotifications.map((notification, index) => {
      if (notification.status === 'unread') {
        return (
          <>
            <Menu.Item key={notification.id} component={Link} href={notification.link}>
              <Stack gap="xs">
                <Text size="xs">{notification.content}</Text>
                <Text size="xs" c="dimmed">
                  {timeFromNow(notification.date)}
                </Text>
              </Stack>
            </Menu.Item>
            {index !== mockNotifications.length - 1 && <Divider my={4} />}
          </>
        )
      }
    })
  )

  return (
    <Menu shadow="md" width={250} position="bottom-end" withArrow arrowPosition="center">
      <Menu.Target>
        <ActionIcon size={32} variant="default">
          <IconBell size={16} stroke={1.5} style={{ position: 'relative' }} />
          {mockNotifications.length > 0 && (
            <Badge color="red" size="xs" style={{ position: 'absolute', left: 0, bottom: 0 }}>
              {mockNotifications.length}
            </Badge>
          )}
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Notifications</Menu.Label>
        {notifications}
      </Menu.Dropdown>
    </Menu>
  )
}
