import { useGetMe } from '@/api/auth/me'
import { CONFIG_CONSTANT } from '@/config/constant'
import {
  ActionIcon,
  AppShell,
  Code,
  Group,
  NavLink,
  ScrollArea,
  SegmentedControl,
  Text,
} from '@mantine/core'
import {
  IconAffiliate,
  IconBuilding,
  IconCategory2,
  IconLayoutDashboard,
  IconPackage,
  IconQuote,
  IconUsers,
  IconVocabulary,
} from '@tabler/icons-react'
import Link from 'next/link'
import { useState } from 'react'

export default function NavBar() {
  const { data: user, isLoading: userIsLoading } = useGetMe()

  const [value, setValue] = useState('user')

  const navLinks =
    value === 'user' ? (
      // user nav links
      <NavLink
        href="#"
        label="Quotation"
        childrenOffset={28}
        leftSection={
          <ActionIcon variant="light">
            <IconQuote size="1rem" stroke={1.5} />
          </ActionIcon>
        }
      >
        <NavLink component={Link} href="/quotations/my" label="My quotations" />
        <NavLink component={Link} href="/quotations/create" label="Create quotation" />
      </NavLink>
    ) : (
      // admin nav links
      <>
        <NavLink
          href="#"
          label="Quotation"
          childrenOffset={28}
          leftSection={
            <ActionIcon variant="light">
              <IconQuote size="1rem" stroke={1.5} />
            </ActionIcon>
          }
        >
          <NavLink component={Link} href="/quotations/all" label="All quotations" />
          <NavLink component={Link} href="/quotations/pending" label="Pending quotations" />
        </NavLink>

        <NavLink
          href="#"
          label="Role"
          childrenOffset={28}
          leftSection={
            <ActionIcon variant="light">
              <IconAffiliate size="1rem" stroke={1.5} />
            </ActionIcon>
          }
        >
          <NavLink component={Link} href="/roles/all" label="Roles list" />
          <NavLink component={Link} href="/roles/create" label="Create role" />
        </NavLink>

        <NavLink
          href="#"
          label="User"
          childrenOffset={28}
          leftSection={
            <ActionIcon variant="light">
              <IconUsers size="1rem" stroke={1.5} />
            </ActionIcon>
          }
        >
          <NavLink component={Link} href="/users/all" label="Users list" />
          <NavLink component={Link} href="/users/create" label="Create user" />
        </NavLink>

        <NavLink
          href="#"
          label="Terms and Conditions"
          childrenOffset={28}
          leftSection={
            <ActionIcon variant="light">
              <IconVocabulary size="1rem" stroke={1.5} />
            </ActionIcon>
          }
        >
          <NavLink
            component={Link}
            href="/terms-and-conditions/all"
            label="Terms and conditions list"
          />
          <NavLink
            component={Link}
            href="/terms-and-conditions/create"
            label="Create terms and conditions"
          />
        </NavLink>

        <NavLink
          href="#"
          label="Client"
          childrenOffset={28}
          leftSection={
            <ActionIcon variant="light">
              <IconBuilding size="1rem" stroke={1.5} />
            </ActionIcon>
          }
        >
          <NavLink component={Link} href="/clients/all" label="Clients list" />
          <NavLink component={Link} href="/clients/create" label="Create client" />
        </NavLink>

        <NavLink
          href="#"
          label="Category"
          childrenOffset={28}
          leftSection={
            <ActionIcon variant="light">
              <IconCategory2 size="1rem" stroke={1.5} />
            </ActionIcon>
          }
        >
          <NavLink component={Link} href="/categories/all" label="Categories list" />
          <NavLink component={Link} href="/categories/create" label="Create category" />
        </NavLink>

        <NavLink
          href="#"
          label="Product"
          childrenOffset={28}
          leftSection={
            <ActionIcon variant="light">
              <IconPackage size="1rem" stroke={1.5} />
            </ActionIcon>
          }
        >
          <NavLink component={Link} href="/products/all" label="Products list" />
          <NavLink component={Link} href="/products/create" label="Create product" />
        </NavLink>
      </>
    )

  return (
    <>
      <AppShell.Section>
        <Group justify="space-between" mb="sm">
          <Text fw={700}>QPGS</Text>
          <Code>v0.0.99</Code>
        </Group>

        {user?.data.role.name === CONFIG_CONSTANT.DB_ROLE_ADMIN_NAME && (
          <Group justify="center" mb="lg">
            <SegmentedControl
              value={value}
              onChange={setValue}
              data={[
                { label: 'User', value: 'user' },
                { label: 'Admin', value: 'admin' },
              ]}
            />
          </Group>
        )}
      </AppShell.Section>

      <AppShell.Section grow component={ScrollArea}>
        <div>
          <NavLink
            leftSection={
              <ActionIcon variant="light">
                <IconLayoutDashboard size="1rem" stroke={1.5} />
              </ActionIcon>
            }
            component={Link}
            href="/dashboard"
            label="Dashboard"
          />

          {navLinks}
        </div>
      </AppShell.Section>
    </>
  )
}
