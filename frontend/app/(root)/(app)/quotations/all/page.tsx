'use client'
import { api } from '@/app/lib/api'
import { useUser } from '@/app/lib/auth'
import { convertSnakeToTitleCase, currencyNumber, formatDate } from '@/app/utils/format'
import { ActionIcon, Badge, Group, Stack, Table, Text, Title } from '@mantine/core'
import { IconArrowRight, IconSortAscending, IconSortDescending } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import {
  SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { AxiosError } from 'axios'
import Link from 'next/link'
import { useState } from 'react'

export interface Product {
  name: string
  price: number
  markup: number
  vat_ex: number
  vat_inc: number
  duration: number
  quantity: number
  vat_type: string
  description: string
  payment_type: string
  total_amount: number
}

interface QuotationsResponse {
  data: Quotation[]
}

export interface Quotation {
  id: string
  month_year: string
  type: string
  subject: string
  date: string
  expiry_date: string
  note: string
  terms_and_conditions: string
  client: {
    id: number
    name: string
    email: string
    tel_no: string
    address: string
    contact_no: string
  }
  products: Product[]
  grand_total: string
  approved_by: number | null
  approved_by_user: {
    first_name: string
    last_name: string
  }
  created_at: string
  updated_at: string
  quotation_status: {
    name: string
  }
  created_by_user: {
    id: number
    first_name: string
    last_name: string
  }
}

const columnHelper = createColumnHelper<Quotation>()

const columns = [
  columnHelper.accessor('id', {
    cell: (info) => info.getValue(),
    header: (info) => convertSnakeToTitleCase(info.column.id),
  }),
  columnHelper.accessor('subject', {
    cell: (info) => info.getValue(),
    header: (info) => convertSnakeToTitleCase(info.column.id),
  }),
  columnHelper.accessor('client.name', {
    cell: (info) => info.getValue(),
    header: (info) => convertSnakeToTitleCase(info.column.id),
  }),
  columnHelper.accessor('grand_total', {
    cell: (info) => currencyNumber(+info.getValue()),
    header: (info) => convertSnakeToTitleCase(info.column.id),
  }),
  columnHelper.accessor('quotation_status.name', {
    cell: (info) => (
      <Badge color={info.getValue() === 'approved' ? 'green' : 'orange'}>
        {info.getValue().toUpperCase()}
      </Badge>
    ),
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
        href={`/quotations/${encodeURIComponent(props.row.original.id)}`}
        size={24}
        variant="default"
      >
        <IconArrowRight size={16} stroke={1.5} />
      </ActionIcon>
    ),
  }),
]

async function fetchAllQuotations() {
  const res = await api.get<QuotationsResponse>('/quotations')
  return res.data.data
}

export default function AllQuotations() {
  const quotations = useQuery({
    queryKey: ['quotations'],
    queryFn: fetchAllQuotations,
    staleTime: 0,
    initialData: [],
  })

  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data: quotations.data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  })

  // TODO: Handle pending state
  if (quotations.isPending) {
    return <span>Users pending...</span>
  }

  // TODO: Handle error state
  if (quotations.isError) {
    if (quotations.error instanceof AxiosError) {
      return <span>Error: {quotations.error.response?.data.message}</span>
    }

    return <span>Error: {quotations.error.message}</span>
  }

  return (
    <Stack>
      <Title>All quotations</Title>

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
            {!quotations.data.length && (
              <Table.Tr>
                <Table.Td colSpan={9} align="center">
                  <Text>No quotations</Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </Stack>
  )
}
