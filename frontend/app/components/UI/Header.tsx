import { useLogout, useUser } from '@/app/lib/auth'
import { Anchor, Avatar, Burger, Drawer, Flex, Group, List, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import ColorSchemeButton from './ColorSchemeButton'
import Logo from './Logo'
import NotificationButton from './NotificationButton'
import Link from 'next/link'
import NotificationMenu from '../dashboard/NotificationMenu'

function DrawerTitle({
  data,
}: {
  data: { first_name: string; username: string; last_name: string }
}) {
  return (
    <Group w="100%" wrap="nowrap">
      <Avatar size={32}>{data.first_name}</Avatar>
      <Flex gap={0} flex={1} direction="column" miw={0}>
        <Text span size="xs" fw={700} truncate="end">
          {data.username}
        </Text>
        <Text span size="xs" truncate="end">
          {data.first_name} {data.last_name}
        </Text>
      </Flex>
    </Group>
  )
}

export default function Header({ opened, toggle }: { opened: boolean; toggle: () => void }) {
  const { data } = useUser()

  const [isDrawerOpened, { open, close }] = useDisclosure(false)

  const logout = useLogout()

  return (
    <Group h="100%" px="md" justify="space-between">
      <Drawer
        opened={isDrawerOpened}
        onClose={close}
        position="right"
        radius="md"
        size={320}
        styles={{
          title: {
            width: '75%',
          },
        }}
        title={<DrawerTitle data={data} />}
      >
        <List>
          <List.Item>
            <Anchor component={Link} href="/profile" onClick={() => close()}>
              <Text span size="sm">
                Your profile
              </Text>
            </Anchor>
          </List.Item>

          <List.Item>
            <Anchor
              onClick={() => {
                logout.mutate()
              }}
            >
              <Text span size="sm">
                Log out
              </Text>
            </Anchor>
          </List.Item>
        </List>
      </Drawer>

      <Group gap="xs">
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        <Logo size={32} />
      </Group>

      <Group gap={8}>
        {/* <NotificationButton actionSize={32} iconSize={16} /> */}
        <NotificationMenu />

        <ColorSchemeButton actionSize={32} iconSize={16} />

        <Avatar
          alt={`${data.first_name} ${data.last_name}`}
          variant="light"
          size={32}
          onClick={open}
          style={{
            cursor: 'pointer',
          }}
        >
          {data.first_name}
        </Avatar>
      </Group>
    </Group>
  )
}
