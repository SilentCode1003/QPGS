'use client'

import { Product, useGetAllProducts } from '@/api/products/all'
import CardTableLayout from '@/app/(protected)/_components/CardTableLayout'
import NoDataYet from '@/components/NoDataYet'
import TableLoading from '@/components/TableLoading'
import { formatDateTimeToMonthDateYearTime } from '@/utils/date'
import { ActionIcon, ActionIconGroup, NumberFormatter, rem, Table, Title } from '@mantine/core'
import { IconExternalLink } from '@tabler/icons-react'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import Link from 'next/link'
import DescriptionRender from '../../../_components/DescriptionRender'

const defaultData: Product[] = []

const columnHelper = createColumnHelper<Product>()

const columns = [
  columnHelper.accessor('id', {
    header: 'Id',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('name', {
    header: 'Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('description', {
    header: 'Description',
    cell: (info) => <DescriptionRender content={info.getValue()} />,
  }),
  columnHelper.accessor('price', {
    header: 'Price',
    cell: (info) => (
      <NumberFormatter
        prefix="₱"
        value={info.getValue()}
        thousandSeparator=","
        decimalSeparator="."
        decimalScale={2}
      />
    ),
  }),
  columnHelper.accessor('category', {
    header: 'Category',
    cell: (info) => info.getValue().name,
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
            href={`/products/${props.row.original.id}`}
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

export default function ProductsList() {
  const { data, isLoading } = useGetAllProducts()

  const table = useReactTable({
    data: data?.data || defaultData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div>
      <Title my={32}>Products List</Title>

      <div>
        {isLoading ? (
          <TableLoading />
        ) : data?.data.length === 0 ? (
          <NoDataYet resourceName="products" />
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
