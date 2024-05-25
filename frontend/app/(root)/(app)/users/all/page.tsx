'use client'
import { api } from '@/app/lib/api'
import { convertSnakeToTitleCase, formatDate } from '@/app/utils/format'
import { ActionIcon, ButtonGroup, Stack, Table, Title } from '@mantine/core'
import { IconArrowRight, IconEdit, IconEye } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'

interface UsersResponse {
  data: User[]
}

interface User {
  id: number
  first_name: string
  last_name: string
  email: string
  username: string
  signature: any
  job_title: string
  created_at: string
  updated_at: string
  role: {
    name: string
  }
}

async function fetchUsers() {
  const data = await api.get<UsersResponse>(`/users`)
  return data.data.data
}

export default function AllUsers() {
  const users = useQuery({ queryKey: ['users'], queryFn: fetchUsers, staleTime: 0 })

  // TODO: Handle pending state
  if (users.isPending) {
    return <span>Users pending...</span>
  }

  // TODO: Handle error state
  if (users.isError) {
    return <span>Error: {users.error.message}</span>
  }

  // Loop over header row
  const tableHeaderRows = Object.keys(users.data[0]).map((key) => {
    return <Table.Th key={key}>{convertSnakeToTitleCase(key)}</Table.Th>
  })

  // Loop over rows
  const rows = users.data.map((user) => {
    // Loop over user keys to dynamically create data
    const columns = Object.keys(user).map((key) => {
      // Add conditions to format data
      if (key === 'created_at' || key === 'updated_at') {
        return <Table.Td key={key}>{formatDate(user[key as keyof User])}</Table.Td>
      } else if (key === 'role') {
        return <Table.Td key={key}>{user[key].name}</Table.Td>
      } else {
        return <Table.Td key={key}>{user[key as keyof User]}</Table.Td>
      }
    })

    return (
      <Table.Tr key={user.id}>
        {columns}
        <Table.Td>
          <ActionIcon
            component={Link}
            href={`/users/${encodeURIComponent(user.id)}`}
            size={24}
            variant="default"
          >
            <IconArrowRight size={16} stroke={1.5} />
          </ActionIcon>
        </Table.Td>
      </Table.Tr>
    )
  })

  return (
    <Stack>
      <Title>All users</Title>

      <Table.ScrollContainer minWidth={950}>
        <Table>
          <Table.Thead>
            <Table.Tr>{tableHeaderRows}</Table.Tr>
          </Table.Thead>

          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </Stack>
  )
}
