import { Paper } from '@mantine/core'

export default function CardTableLayout({ children }: { children: React.ReactNode }) {
  return (
    <Paper p={30} withBorder radius="md">
      {children}
    </Paper>
  )
}
