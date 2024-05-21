import { AuthLoader } from '../lib/auth'
import Login from '../login/page'

export default function AuthLoaderProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthLoader
      renderLoading={() => <div>AuthLoader loading...</div>}
      renderUnauthenticated={() => <Login />}
    >
      {children}
    </AuthLoader>
  )
}
