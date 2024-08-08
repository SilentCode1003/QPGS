import { Paper } from '@mantine/core'

export default function CardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Paper p={16} m={4} radius="md" h="100%">
      {children}
    </Paper>
  )
}
