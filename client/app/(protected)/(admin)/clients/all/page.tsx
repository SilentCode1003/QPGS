'use client'

import { Client, useGetAllClients } from '@/api/clients/all'
import CardTableLayout from '@/app/(protected)/_components/CardTableLayout'
import NoDataYet from '@/components/NoDataYet'
import TableLoading from '@/components/TableLoading'
import { formatDateTimeToMonthDateYearTime } from '@/utils/date'
import { ActionIcon, ActionIconGroup, rem, Table, Title } from '@mantine/core'
import { IconExternalLink } from '@tabler/icons-react'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import Link from 'next/link'

const defaultData: Client[] = []

const columnHelper = createColumnHelper<Client>()

const columns = [
  columnHelper.accessor('id', {
    header: 'Id',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('name', {
    header: 'Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('tel_no', {
    header: 'Telephone No.',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('contact_no', {
    header: 'Contact No.',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('email', {
    header: 'Email',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('address', {
    header: 'Address',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('created_by_user', {
    header: 'Created By',
    cell: (info) => info.getValue().first_name + ' ' + info.getValue().last_name,
  }),
  columnHelper.accessor('is_active', {
    header: 'Is Active',
    cell: (info) => info.getValue().toString(),
  }),
  columnHelper.accessor('created_at', {
    header: 'Created At',
    cell: (info) => formatDateTimeToMonthDateYearTime(info.getValue()),
  }),
  columnHelper.accessor('updated_at', {
    header: 'Updated At',
    cell: (info) => formatDateTimeToMonthDateYearTime(info.getValue()),
  }),
  columnHelper.display({
    id: 'actions',
    cell: (props) => (
      <div>
        <ActionIconGroup>
          <ActionIcon
            component={Link}
            href={`/clients/${props.row.original.id}`}
            variant="default"
            size="md"
          >
            <IconExternalLink style={{ width: rem(16) }} stroke={1.5} />
          </ActionIcon>
        </ActionIconGroup>
      </div>
    ),
  }),
]

export default function ClientsList() {
  const { data, isLoading } = useGetAllClients()

  const table = useReactTable({
    data: data?.data || defaultData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div>
      <Title my={32}>Clients List</Title>

      <div>
        {isLoading ? (
          <TableLoading />
        ) : data?.data.length === 0 ? (
          <NoDataYet resourceName="clients" />
        ) : (
          <CardTableLayout>
            <Table.ScrollContainer minWidth={500}>
              <Table withTableBorder highlightOnHover striped>
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
          </CardTableLayout>
        )}
      </div>
    </div>
  )
}
