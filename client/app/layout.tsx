import type { Metadata } from 'next'
import './globals.css'

import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import '@mantine/charts/styles.css'
import '@mantine/tiptap/styles.css'
import '@mantine/dates/styles.css'

import ReactQueryWrapper from '@/components/ReactQueryWrapper'
import { ColorSchemeScript, MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { ModalsProvider } from '@mantine/modals'

export const metadata: Metadata = {
  title: 'QPGS',
  description: 'Quotation and Purchase Order Generator System',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <ReactQueryWrapper>
          <MantineProvider>
            <Notifications />
            <ModalsProvider>{children}</ModalsProvider>
          </MantineProvider>
        </ReactQueryWrapper>
      </body>
    </html>
  )
}
