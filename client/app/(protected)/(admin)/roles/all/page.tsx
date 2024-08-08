'use client'

import { Role, useGetAllRoles } from '@/api/roles/all'
import CardTableLayout from '@/app/(protected)/_components/CardTableLayout'
import NoDataYet from '@/components/NoDataYet'
import TableLoading from '@/components/TableLoading'
import { formatDateTimeToMonthDateYearTime } from '@/utils/date'
import { Table, Title } from '@mantine/core'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

const defaultData: Role[] = []

const columnHelper = createColumnHelper<Role>()

const columns = [
  columnHelper.accessor('id', {
    header: 'Id',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('name', {
    header: 'Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('created_at', {
    header: 'Created at',
    cell: (info) => formatDateTimeToMonthDateYearTime(info.getValue()),
  }),
]

export default function RolesList() {
  const { data, isLoading } = useGetAllRoles()

  const table = useReactTable({
    data: data?.data || defaultData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div>
      <Title my={32}>Roles List</Title>

      <div>
        {isLoading ? (
          <TableLoading />
        ) : data?.data.length === 0 ? (
          <NoDataYet resourceName="roles" />
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
