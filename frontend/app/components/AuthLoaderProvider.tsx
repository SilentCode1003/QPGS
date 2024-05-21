import { useUser } from '../lib/auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

type NavigateProps = { to: string; replace?: boolean }

export function Navigate({ to, replace = false }: NavigateProps): null {
  const router = useRouter()

  useEffect(() => {
    if (replace) {
      router.replace(to)
    } else {
      router.push(to)
    }
  }, [replace, router, to])

  return null
}

export default function AuthLoaderProvider({ children }: { children: React.ReactNode }) {
  const { data, isPending, isError, error } = useUser()

  if (isPending) {
    return <div>AuthLoader loading...</div>
  }

  if (isError) {
    return <span>{JSON.stringify(error)}</span>
  }

  if (!data) {
    return <Navigate to="/login" replace={true} />
  } else {
    return children
  }
}
