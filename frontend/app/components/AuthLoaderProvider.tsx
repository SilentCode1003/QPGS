import { AuthLoader } from '../lib/auth'

export default function AuthLoaderProvider({ children }: { children: React.ReactNode }) {
  return <AuthLoader renderLoading={() => <div>AuthLoader loading...</div>}>{children}</AuthLoader>
}
