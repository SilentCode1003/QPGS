'use client'
import { api } from '@/app/lib/api'
import { convertSnakeToTitleCase, formatDate } from '@/app/utils/format'
import { ActionIcon, Center, Group, Stack, Table, Text, Title } from '@mantine/core'
import { IconArrowRight, IconSortAscending, IconSortDescending } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import {
  SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useState } from 'react'

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
        variant="default"
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

  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data: users.data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
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
                    {header.isPlaceholder ? null : (
                      <Group onClick={header.column.getToggleSortingHandler()}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: <IconSortAscending size={16} />,
                          desc: <IconSortDescending size={16} />,
                        }[header.column.getIsSorted() as string] ?? null}
                      </Group>
                    )}
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
            {!users.data.length && (
              <Table.Tr>
                <Table.Td colSpan={9} align="center">
                  <Text>No users</Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </Stack>
  )
}
