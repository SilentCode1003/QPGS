import { ActionIcon, Menu, Tooltip, useMantineColorScheme } from '@mantine/core'
import { IconMoon, IconSun } from '@tabler/icons-react'

export default function ToggleThemeMenu() {
  const { setColorScheme } = useMantineColorScheme()

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Tooltip label="Switch color modes">
          <ActionIcon size="md" variant="subtle">
            <IconSun />
          </ActionIcon>
        </Tooltip>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Select color modes</Menu.Label>
        <Menu.Item leftSection={<IconSun size={14} />} onClick={() => setColorScheme('light')}>
          Light
        </Menu.Item>
        <Menu.Item leftSection={<IconMoon size={14} />} onClick={() => setColorScheme('dark')}>
          Dark
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}
