'use client'
import { api } from '@/app/lib/api'
import { convertSnakeToTitleCase, formatDate } from '@/app/utils/format'
import { ActionIcon, Stack, Table, Title } from '@mantine/core'
import { IconArrowRight } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

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

const columnHelper = createColumnHelper<User>()

const columns = [
  columnHelper.accessor('id', {
    cell: (info) => info.getValue(),
    header: (info) => convertSnakeToTitleCase(info.column.id),
  }),
  columnHelper.accessor('first_name', {
    cell: (info) => info.getValue(),
    header: (info) => convertSnakeToTitleCase(info.column.id),
  }),
  columnHelper.accessor('last_name', {
    cell: (info) => info.getValue(),
    header: (info) => convertSnakeToTitleCase(info.column.id),
  }),
  columnHelper.accessor('role.name', {
    cell: (info) => info.getValue(),
    header: 'Role',
  }),
  columnHelper.accessor('email', {
    cell: (info) => info.getValue(),
    header: (info) => convertSnakeToTitleCase(info.column.id),
  }),
  columnHelper.accessor('username', {
    cell: (info) => info.getValue(),
    header: (info) => convertSnakeToTitleCase(info.column.id),
  }),
  columnHelper.accessor('signature', {
    cell: (info) => info.getValue(),
    header: (info) => convertSnakeToTitleCase(info.column.id),
  }),
  columnHelper.accessor('created_at', {
    cell: (info) => formatDate(new Date(info.getValue())),
    header: (info) => convertSnakeToTitleCase(info.column.id),
  }),
  columnHelper.accessor('updated_at', {
    cell: (info) => formatDate(new Date(info.getValue())),
    header: (info) => convertSnakeToTitleCase(info.column.id),
  }),
  columnHelper.display({
    id: 'actions',
    cell: (props) => (
      <ActionIcon
        component={Link}
        href={`/users/${encodeURIComponent(props.row.original.id)}`}
        size={24}
      >
        <IconArrowRight size={16} stroke={1.5} />
      </ActionIcon>
    ),
  }),
]

async function fetchUsers() {
  const data = await api.get<UsersResponse>(`/users`)
  return data.data.data
}

export default function AllUsers() {
  const users = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    staleTime: 0,
    initialData: [],
  })

  const table = useReactTable({
    data: users.data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  // TODO: Handle pending state
  if (users.isPending) {
    return <span>Users pending...</span>
  }

  // TODO: Handle error state
  if (users.isError) {
    return <span>Error: {users.error.message}</span>
  }

  return (
    <Stack>
      <Title>All users</Title>

      <Table.ScrollContainer minWidth={950}>
        <Table withTableBorder>
          <Table.Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Table.Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Table.Th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </Table.Th>
                ))}
              </Table.Tr>
            ))}
          </Table.Thead>

          <Table.Tbody>
            {table.getRowModel().rows.map((row) => (
              <Table.Tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <Table.Td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Table.Td>
                ))}
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </Stack>
  )
}
