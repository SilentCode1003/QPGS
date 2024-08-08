'use client'
import { useGetMe } from '@/api/auth/me'
import { Flex, Loader } from '@mantine/core'
import { usePathname } from 'next/navigation'
import Navigate from './Navigate'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const { data, isLoading, isError } = useGetMe()

  if (isLoading) {
    return (
      <Flex h="100vh" w="100vw" justify="center" align="center">
        <Loader size={200} type="dots" />
      </Flex>
    )
  }

  if (!data?.data || isError) {
    return <Navigate to={`/login?redirectTo=${encodeURIComponent(pathname)}`} />
  }

  return children
}
