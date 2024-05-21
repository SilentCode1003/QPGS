'use client'
import { AppShell, Burger } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import AuthLoaderProvider from '../components/AuthLoaderProvider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure()

  return (
    <AuthLoaderProvider>
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: 300,
          breakpoint: 'sm',
          collapsed: { mobile: !opened },
        }}
        padding="md"
      >
        <AppShell.Header>
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <div>Logo</div>
        </AppShell.Header>

        <AppShell.Navbar>Navbar</AppShell.Navbar>

        <AppShell.Main>{children}</AppShell.Main>
      </AppShell>
    </AuthLoaderProvider>
  )
}
