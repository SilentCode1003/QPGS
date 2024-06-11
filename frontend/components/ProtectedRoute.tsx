'use client'
import { useUser } from '@/hooks/useUser'
import { usePathname, useRouter } from 'next/navigation'

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isLoading, isError } = useUser()

  if (isLoading) {
    return <span>Auth Loading...</span>
  }

  if (!user || isError) {
    router.push(`/login?redirectTo=${encodeURIComponent(pathname)}`)
    return null
  }

  return children
}
