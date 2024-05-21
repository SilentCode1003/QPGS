import { useUser } from '@/app/lib/auth'
import { ActionIcon, Avatar, Burger, Drawer, Group, useMantineColorScheme } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import Logo from './Logo'
import { IconMoon } from '@tabler/icons-react'
import ColorSchemeButton from './ColorSchemeButton'
import NotificationButton from './NotificationButton'

export default function Header({ opened, toggle }: { opened: boolean; toggle: () => void }) {
  const { data } = useUser()

  const [isDrawerOpened, { open, close }] = useDisclosure(false)

  return (
    <>
      <Drawer opened={isDrawerOpened} onClose={close} position="right">
        <h1>Hi everyone, markiplier here</h1>
      </Drawer>

      <Group h="100%" px="md" justify="space-between">
        <Group gap="xs">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Logo size={32} />
        </Group>

        <Group gap={8}>
          <NotificationButton actionSize={32} iconSize={16} />

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
    </>
  )
}
