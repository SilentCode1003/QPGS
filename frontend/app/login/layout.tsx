'use client'
import { Navigate } from '../components/AuthLoaderProvider'
import { useUser } from '../lib/auth'

export default function Layout({ children }: { children: React.ReactNode }) {
  // Redirect to /dashboard if user is already logged in
  const { data, isPending, isError, error } = useUser()

  if (isPending) {
    return <div>Login layout loading...</div>
  }

  if (isError) {
    return <span>{JSON.stringify(error)}</span>
  }

  if (data) {
    return <Navigate to="/dashboard" replace={true} />
  } else {
    return children
  }
}
