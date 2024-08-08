import { Suspense } from 'react'
import Login from './_components/login'

export default function LoginPage() {
  return (
    <Suspense>
      <Login />
    </Suspense>
  )
}
