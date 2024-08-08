import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Navigate({ to }: { to: string }) {
  const router = useRouter()

  useEffect(() => {
    router.push(to)
  }, [router, to])

  return null
}
