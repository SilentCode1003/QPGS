import { useLogout, useUser } from '@/app/lib/auth'
import { Anchor, Avatar, Drawer, Flex, Group, List, Text, ThemeIcon } from '@mantine/core'
import { IconLogout, IconUser } from '@tabler/icons-react'
import Link from 'next/link'
import React from 'react'

function DrawerTitle({
  data,
}: {
  data: { first_name: string; username: string; last_name: string }
}) {
  return (
    <Group w="100%" wrap="nowrap">
      <Avatar size={32}>{data.first_name}</Avatar>
      <Flex gap={0} flex={1} direction="column" miw={0}>
        <Text span size="xs" fw={700} truncate="end">
          {data.username}
        </Text>
        <Text span size="xs" truncate="end">
          {data.first_name} {data.last_name}
        </Text>
      </Flex>
    </Group>
  )
}

export default function HeaderDrawer({
  isDrawerOpened,
  data,
  close,
}: {
  isDrawerOpened: boolean
  data: any
  close: () => void
}) {
  const logout = useLogout()

  return (
    <Drawer
      opened={isDrawerOpened}
      onClose={close}
      position="right"
      radius="md"
      size={320}
      styles={{
        title: {
          width: '75%',
        },
      }}
      title={<DrawerTitle data={data} />}
    >
      <List spacing="xs" size="sm" center>
        <List.Item
          icon={
            <ThemeIcon color="gray" size={24} radius="xl">
              <IconUser size={16} stroke={1.5} />
            </ThemeIcon>
          }
        >
          <Anchor component={Link} href="/profile" onClick={() => close()}>
            <Text span size="sm">
              Your profile
            </Text>
          </Anchor>
        </List.Item>

        <List.Item
          icon={
            <ThemeIcon color="gray" size={24} radius="xl">
              <IconLogout size={16} stroke={1.5} />
            </ThemeIcon>
          }
        >
          <Anchor
            onClick={() => {
              logout.mutate()
            }}
          >
            <Text span size="sm">
              Log out
            </Text>
          </Anchor>
        </List.Item>
      </List>
    </Drawer>
  )
}
