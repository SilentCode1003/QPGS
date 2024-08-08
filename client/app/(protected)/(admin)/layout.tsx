'use client'
import { useGetMe } from '@/api/auth/me'
import { CONFIG_CONSTANT } from '@/config/constant'
import { Flex, Loader } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useRouter } from 'next/navigation'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  const { data, isLoading, isError } = useGetMe()

  if (isLoading) {
    return (
      <Flex h="100vh" w="100vw" justify="center" align="center">
        <Loader size={200} type="dots" />
      </Flex>
    )
  }

  if (data?.data.role.name !== CONFIG_CONSTANT.DB_ROLE_ADMIN_NAME || isError) {
    router.push('/login')
    notifications.show({ title: 'Error', message: 'Forbidden', color: 'red' })
    return null
  }

  return children
}
