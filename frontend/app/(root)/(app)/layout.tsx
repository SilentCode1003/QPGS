'use client'
import Header from '@/app/components/UI/Header'
import Navbar from '@/app/components/UI/Navbar'
import { AppShell } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import AuthLoaderProvider from '../../components/AuthLoaderProvider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure()

  return (
    <AuthLoaderProvider>
      <AppShell
        header={{ height: 64 }}
        navbar={{
          width: 300,
          breakpoint: 'sm',
          collapsed: { mobile: !opened },
        }}
        padding="md"
      >
        <AppShell.Header>
          <Header opened={opened} toggle={toggle} />
        </AppShell.Header>

        <AppShell.Navbar>
          <Navbar />
        </AppShell.Navbar>

        <AppShell.Main>{children}</AppShell.Main>
      </AppShell>
    </AuthLoaderProvider>
  )
}
