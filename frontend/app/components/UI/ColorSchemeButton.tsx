import { ActionIcon, useComputedColorScheme, useMantineColorScheme } from '@mantine/core'
import { IconMoon, IconSun } from '@tabler/icons-react'

export default function ColorSchemeButton({
  actionSize,
  iconSize,
}: {
  actionSize: number
  iconSize: number
}) {
  const { setColorScheme } = useMantineColorScheme()
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true })

  return (
    <ActionIcon
      onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
      variant="default"
      size={actionSize}
      aria-label="Toggle color scheme"
    >
      {computedColorScheme === 'dark' && <IconSun size={iconSize} stroke={1.5} />}
      {computedColorScheme === 'light' && <IconMoon size={iconSize} stroke={1.5} />}
    </ActionIcon>
  )
}
