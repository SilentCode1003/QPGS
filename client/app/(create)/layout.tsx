import ProtectedRoute from '@/components/ProtectedRoute'

export default function CreateLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute>{children}</ProtectedRoute>
}
