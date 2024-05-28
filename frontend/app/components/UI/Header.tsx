import { useUser } from '@/app/lib/auth'
import { Avatar, Burger, Group } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import HeaderDrawer from '../dashboard/HeaderDrawer'
import NotificationMenu from '../dashboard/NotificationMenu'
import ColorSchemeButton from './ColorSchemeButton'
import Logo from './Logo'

export default function Header({ opened, toggle }: { opened: boolean; toggle: () => void }) {
  const { data } = useUser()

  const [isDrawerOpened, { open, close }] = useDisclosure(false)

  return (
    <Group h="100%" px="md" justify="space-between">
      <HeaderDrawer data={data} isDrawerOpened={isDrawerOpened} close={close} />

      <Group gap="xs">
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        <Logo size={32} />
      </Group>

      <Group gap={8}>
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
