'use client'

import { Category, useGetAllCategories } from '@/api/categories/all'
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

const defaultData: Category[] = []

const columnHelper = createColumnHelper<Category>()

const columns = [
  columnHelper.accessor('id', {
    header: 'Id',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('name', {
    header: 'Name',
    cell: (info) => info.getValue(),
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
            href={`/categories/${props.row.original.id}`}
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

export default function CategoriesList() {
  const { data, isLoading } = useGetAllCategories()

  const table = useReactTable({
    data: data?.data || defaultData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div>
      <Title my={32}>Categories List</Title>

      <div>
        {isLoading ? (
          <TableLoading />
        ) : data?.data.length === 0 ? (
          <NoDataYet resourceName="categories" />
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
