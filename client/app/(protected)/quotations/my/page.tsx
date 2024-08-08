'use client'
import { useGetMe } from '@/api/auth/me'
import { Quotation, useGetAllQuotations } from '@/api/quotations/all'
import NoDataYet from '@/components/NoDataYet'
import QuotationStatusBadge from '@/components/QuotationStatusBadge'
import TableLoading from '@/components/TableLoading'
import { formatDateTimeToMonthDateYear, formatDateTimeToMonthDateYearTime } from '@/utils/date'
import { ActionIcon, ActionIconGroup, NumberFormatter, rem, Table, Title } from '@mantine/core'
import { IconExternalLink } from '@tabler/icons-react'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import Link from 'next/link'
import CardTableLayout from '../../_components/CardTableLayout'
import { useState } from 'react'

const defaultData: Quotation[] = []

const columnHelper = createColumnHelper<Quotation>()

const columns = [
  columnHelper.accessor('reference_id', {
    header: 'Reference Id',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('category.name', {
    header: 'Category',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('subject', {
    header: 'Subject',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('date', {
    header: 'Date',
    cell: (info) => formatDateTimeToMonthDateYear(info.getValue()),
  }),
  columnHelper.accessor('expiry_date', {
    header: 'Expiry Date',
    cell: (info) => formatDateTimeToMonthDateYear(info.getValue()),
  }),
  columnHelper.accessor('client.name', {
    header: 'Client',
    cell: (info) => <div className="max-h-16 overflow-x-auto">{info.getValue()}</div>,
  }),
  columnHelper.accessor('quotation_status', {
    header: 'Status',
    cell: (info) => <QuotationStatusBadge status={info.getValue()} />,
  }),
  columnHelper.accessor('grand_total', {
    header: 'Grand Total',
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
  columnHelper.accessor('created_by_user', {
    header: 'Created By',
    cell: (info) => info.getValue().first_name + ' ' + info.getValue().last_name,
  }),
  columnHelper.accessor('approved_by_user', {
    header: 'Approved By',
    cell: (info) =>
      info.getValue() && info.getValue()?.first_name + ' ' + info.getValue()?.last_name,
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
            href={`/quotations/${props.row.original.id}`}
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

export default function MyQuotations() {
  const { data: user } = useGetMe()
  const { data: quotations, isLoading: quotationsIsLoading } = useGetAllQuotations({
    created_by_id: user?.data.id.toString(),
  })

  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data: quotations?.data || defaultData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  })

  return (
    <div>
      <Title my={32}>My Quotations</Title>

      <div>
        {quotationsIsLoading ? (
          <TableLoading />
        ) : quotations?.data.length === 0 ? (
          <NoDataYet resourceName="quotations" />
        ) : (
          <CardTableLayout>
            <Table.ScrollContainer minWidth={500}>
              <Table withTableBorder highlightOnHover striped>
                <Table.Thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <Table.Tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <Table.Th key={header.id}>
                          {header.isPlaceholder ? null : (
                            // : flexRender(header.column.columnDef.header, header.getContext())}
                            <div
                              className={header.column.getCanSort() ? 'cursor-pointer' : ''}
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              {flexRender(header.column.columnDef.header, header.getContext())}
                              {{
                                asc: ' 🔼',
                                desc: ' 🔽',
                              }[header.column.getIsSorted() as string] ?? null}
                            </div>
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
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>
          </CardTableLayout>
        )}
      </div>
    </div>
  )
}
