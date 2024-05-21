import { Anchor } from '@mantine/core'
import Link from 'next/link'

export default function Home() {
  return (
    <div>
      <h1>Welcome page</h1>
      <p>Already have an account?</p>
      <Anchor component={Link} href={'/login'}>
        Log in
      </Anchor>
    </div>
  )
}
