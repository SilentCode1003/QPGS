import { useLogout } from '@/api/auth/logout'
import { useGetMe } from '@/api/auth/me'
import { Avatar, Menu, rem, Skeleton } from '@mantine/core'
import { IconLogout, IconSettings } from '@tabler/icons-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function UserMenu() {
  const router = useRouter()

  const { data, isLoading } = useGetMe()
  const { mutateAsync: logout, isPending } = useLogout()

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/login')
    } catch (error) {
      console.error(error)
    }
  }

  if (isLoading) {
    return <Skeleton h={38} w={38} circle />
  }

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Avatar
          name={`${data?.data.first_name} ${data?.data.last_name}`}
          color="initials"
          className="cursor-pointer"
        />
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Account</Menu.Label>

        <Menu.Item
          component={Link}
          href="/account/settings"
          leftSection={<IconSettings style={{ width: rem(14), height: rem(14) }} />}
        >
          Settings
        </Menu.Item>

        <Menu.Divider />

        <Menu.Label>Actions</Menu.Label>

        <Menu.Item
          onClick={handleLogout}
          leftSection={<IconLogout style={{ width: rem(14), height: rem(14) }} />}
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}
