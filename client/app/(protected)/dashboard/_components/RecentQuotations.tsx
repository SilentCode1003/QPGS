'use client'

import { Quotation } from '@/api/quotations/all'
import { useGetRecentQuotations } from '@/api/quotations/recent'
import NoDataYet from '@/components/NoDataYet'
import QuotationStatusBadge from '@/components/QuotationStatusBadge'
import ReactTableTemplate from '@/components/ReactTableTemplate'
import TableLoading from '@/components/TableLoading'
import { formatDateTimeToMonthDateYearTime } from '@/utils/date'
import { ActionIcon, ActionIconGroup, rem, Text } from '@mantine/core'
import { IconExternalLink } from '@tabler/icons-react'
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import Link from 'next/link'
import CardLayout from './CardLayout'

const defaultData: Quotation[] = []

const columnHelper = createColumnHelper<Quotation>()

const columns = [
  columnHelper.accessor('reference_id', {
    header: 'Id',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('subject', {
    header: 'Subject',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('quotation_status', {
    header: 'Status',
    cell: (info) => <QuotationStatusBadge status={info.getValue()} />,
  }),
  columnHelper.accessor('created_by_user', {
    header: 'Created by',
    cell: (info) => info.getValue().first_name + ' ' + info.getValue().last_name,
  }),
  columnHelper.accessor('created_at', {
    header: 'Created At',
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

export default function RecentQuotations() {
  const { data, isLoading, isError } = useGetRecentQuotations()

  const table = useReactTable({
    data: data?.data || defaultData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <CardLayout>
      <Text size="lg" fw={700} mb="lg">
        Recent quotations
      </Text>

      {isLoading ? (
        <TableLoading />
      ) : data?.data.length === 0 ? (
        <NoDataYet resourceName="quotations" />
      ) : (
        !isError && <ReactTableTemplate table={table} />
      )}

      {isError && <Text size="sm">Error</Text>}
    </CardLayout>
  )
}
