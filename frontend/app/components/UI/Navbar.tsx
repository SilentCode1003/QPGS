import {
  IconBuilding,
  IconBuildingWarehouse,
  IconCash,
  IconLayoutDashboard,
  IconNotes,
  IconUser,
} from '@tabler/icons-react'
import NavbarLinksGroup from '../navbar/NavbarLinksGroup'
import { ScrollArea, Stack } from '@mantine/core'
import { usePathname } from 'next/navigation'

const navbarLinks = [
  {
    label: 'Dashboard',
    link: '/dashboard',
    icon: IconLayoutDashboard,
  },
  {
    label: 'Quotations',
    icon: IconNotes,
    links: [
      { label: 'Create quotation', link: '/quotations/create' },
      { label: 'Your quotations', link: '/quotations/quotations' },
      { label: 'All quotations', link: '/quotations/all' },
    ],
  },
  {
    label: 'Purchase Orders',
    icon: IconCash,
    links: [
      { label: 'Create purchase order', link: '/purchase-orders/create' },
      { label: 'All purchase orders', link: '/purchase-orders/all' },
    ],
  },
  {
    label: 'Products/Services',
    icon: IconBuildingWarehouse,
    links: [
      { label: 'All products', link: '/products/all' },
      { label: 'Create product', link: '/products/create' },
      { label: 'Edit product', link: '/products/edit' },
    ],
  },
  {
    label: 'Users',
    icon: IconUser,
    links: [
      { label: 'All users', link: '/users/all' },
      { label: 'Register user', link: '/users/register' },
      { label: 'Edit user', link: '/users/edit' },
    ],
  },
  {
    label: 'Clients',
    icon: IconBuilding,
    links: [
      { label: 'All clients', link: '/clients/all' },
      { label: 'Add client', link: '/clients/add' },
      { label: 'Edit client', link: '/clients/edit' },
    ],
  },
]

export default function Navbar() {
  const pathname = usePathname()

  const links = navbarLinks.map((item) => (
    <NavbarLinksGroup {...item} pathname={pathname} key={item.label} />
  ))
  return (
    <ScrollArea pt="xl" p="lg">
      <Stack gap="sm">{links}</Stack>
    </ScrollArea>
  )
}
