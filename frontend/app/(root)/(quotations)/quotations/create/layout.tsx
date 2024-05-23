'use client'
import AuthLoaderProvider from '@/app/components/AuthLoaderProvider'

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AuthLoaderProvider>{children}</AuthLoaderProvider>
}
