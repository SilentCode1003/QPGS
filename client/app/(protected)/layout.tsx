import ProtectedRoute from '@/components/ProtectedRoute'
import AppShellWrapper from './_components/AppShellWrapper'

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <AppShellWrapper>{children}</AppShellWrapper>
    </ProtectedRoute>
  )
}
