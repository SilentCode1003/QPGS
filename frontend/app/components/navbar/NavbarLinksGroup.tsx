import { NavLink } from '@mantine/core'
import Link from 'next/link'

interface LinksGroupProps {
  icon: React.FC<any>
  label: string
  link?: string
  links?: { label: string; link: string }[]
}

export default function NavbarLinksGroup({ icon: Icon, label, link, links }: LinksGroupProps) {
  const hasLinks = Array.isArray(links)
  const items = (hasLinks ? links : []).map((linkItem) => (
    <NavLink component={Link} key={linkItem.label} href={linkItem.link} label={linkItem.label} />
  ))

  return hasLinks ? (
    <NavLink label={label} leftSection={<Icon size="1.2rem" stroke={1.5} />} childrenOffset={28}>
      {items}
    </NavLink>
  ) : (
    <NavLink
      component={Link}
      href={link ? link : ''}
      label={label}
      leftSection={<Icon size="1.2rem" stroke={1.5} />}
    />
  )
}
