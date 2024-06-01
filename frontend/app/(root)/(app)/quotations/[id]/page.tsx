'use client'
import { api } from '@/app/lib/api'
import { formatDate, formatDateWithoutTime } from '@/app/utils/format'
import {
  Badge,
  Box,
  Card,
  Center,
  Container,
  Group,
  NumberFormatter,
  Stack,
  Table,
  Text,
  Textarea,
  Title,
} from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { Quotation } from '../all/page'
import ProductRow from '@/app/components/quotations/ProductRow'

interface QuotationResponse {
  data: Quotation
}

async function fetchQuotation(id: string) {
  const res = await api.get<QuotationResponse>(`/quotations/${encodeURIComponent(id)}`)
  return res.data.data
}

export default function QuotationInfo({ params }: { params: { id: string } }) {
  const quotation = useQuery({
    queryKey: [`quotations/${params.id}`],
    queryFn: () => fetchQuotation(params.id),
    staleTime: 0,
  })

  // TODO: Handle pending state
  if (quotation.isPending) {
    return <span>Quotation pending</span>
  }

  // TODO: Handle error state
  if (quotation.isError) {
    if (quotation.error instanceof AxiosError) {
      return <span>Error: {quotation.error.response?.data.message}</span>
    }

    return <span>Error: {quotation.error.message}</span>
  }

  const q = quotation.data

  return (
    <Container size="sm">
      <Stack>
        <Title>Quotation information</Title>

        {/**
         *
         *
         *  First card
         *
         *
         *  */}
        <Card p="xl" shadow="sm" radius="xl">
          <Stack>
            <Text size="lg" fw={700}>
              Quotation details
            </Text>

            <Box>
              <Text c="dimmed" size="sm">
                Id
              </Text>
              <Text size="lg" truncate="end">
                {q.id}
              </Text>
            </Box>

            <Box>
              <Group justify="space-evenly">
                <Box>
                  <Text c="dimmed" size="sm">
                    Status
                  </Text>
                  {/* TODO: Make this a config */}
                  <Badge color={q.quotation_status.name === 'approved' ? 'green' : 'orange'}>
                    {q.quotation_status.name.toUpperCase()}
                  </Badge>
                </Box>

                {q.approved_by && (
                  <Box>
                    <Text c="dimmed" size="sm">
                      Approved by
                    </Text>
                    <Text
                      size="lg"
                      truncate="end"
                    >{`${q.approved_by_user.first_name} ${q.approved_by_user.last_name}`}</Text>
                  </Box>
                )}
              </Group>
            </Box>

            <Box>
              <Text c="dimmed" size="sm">
                Created by
              </Text>
              <Text
                size="lg"
                truncate="end"
              >{`${q.created_by_user.first_name} ${q.created_by_user.last_name} `}</Text>
            </Box>

            <Box>
              <Text c="dimmed" size="sm">
                Created at
              </Text>
              <Text size="lg" truncate="end">
                {formatDate(new Date(q.created_at))}
              </Text>
            </Box>

            <Box>
              <Text c="dimmed" size="sm">
                Updated at
              </Text>
              <Text size="lg" truncate="end">
                {formatDate(new Date(q.updated_at))}
              </Text>
            </Box>
          </Stack>
        </Card>

        {/**
         *
         *
         *  Second card
         *
         *
         *  */}
        <Card p="xl" shadow="sm" radius="xl">
          <Stack>
            <Text size="lg" fw={700}>
              Quotation information
            </Text>

            <Box>
              <Text c="dimmed" size="sm">
                Product type
              </Text>
              <Text size="lg" truncate="end">
                {q.type}
              </Text>
            </Box>

            <Box>
              <Text c="dimmed" size="sm">
                Subject
              </Text>
              <Text size="lg" truncate="end">
                {q.subject}
              </Text>
            </Box>

            <Box>
              <Text c="dimmed" size="sm">
                Date
              </Text>
              <Text size="lg" truncate="end">
                {formatDateWithoutTime(new Date(q.date!))}
              </Text>
            </Box>

            <Box>
              <Text c="dimmed" size="sm">
                Expiry Date
              </Text>
              <Text size="lg" truncate="end">
                {formatDateWithoutTime(new Date(q.expiry_date!))}
              </Text>
            </Box>

            <Box>
              <Text c="dimmed" size="sm">
                Notes
              </Text>
              <Textarea
                size="lg"
                readOnly
                autosize
                minRows={2}
                maxRows={5}
                value={q.note || 'N/A'}
              />
            </Box>

            <Box>
              <Text c="dimmed" size="sm">
                Terms and conditions
              </Text>
              <Textarea
                size="lg"
                readOnly
                autosize
                minRows={2}
                maxRows={5}
                value={q.terms_and_conditions}
              />
            </Box>
          </Stack>
        </Card>

        {/**
         *
         *
         *  Third card
         *
         *
         *  */}
        <Card p="xl" shadow="sm" radius="xl">
          <Stack>
            <Text size="lg" fw={700}>
              Client Information
            </Text>

            <Box>
              <Text c="dimmed" size="sm">
                Client name
              </Text>
              <Text size="lg" truncate="end">
                {q.client?.name}
              </Text>
            </Box>

            <Box>
              <Text c="dimmed" size="sm">
                Telephone no.
              </Text>
              <Text size="lg" truncate="end">
                {q.client?.tel_no || 'N/A'}
              </Text>
            </Box>

            <Box>
              <Text c="dimmed" size="sm">
                Contact no.
              </Text>
              <Text size="lg" truncate="end">
                {q.client?.contact_no}
              </Text>
            </Box>

            <Box>
              <Text c="dimmed" size="sm">
                Email
              </Text>
              <Text size="lg" truncate="end">
                {q.client?.email}
              </Text>
            </Box>

            <Box>
              <Text c="dimmed" size="sm">
                Address
              </Text>
              <Text size="lg" truncate="end">
                {q.client?.address}
              </Text>
            </Box>
          </Stack>
        </Card>

        {/**
         *
         *
         *  Fourth card
         *
         *
         *  */}
        <Card p="xl" shadow="sm" radius="xl">
          <Stack>
            <Text size="lg" fw={700}>
              Items Information
            </Text>

            <Table.ScrollContainer minWidth="100%">
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Description</Table.Th>
                    <Table.Th>Payment type</Table.Th>
                    <Table.Th>Price</Table.Th>
                    <Table.Th>Markup</Table.Th>
                    <Table.Th>VAT Excluded price</Table.Th>
                    <Table.Th>VAT Included price</Table.Th>
                    <Table.Th>Duration (Months)</Table.Th>
                    <Table.Th>Quantity</Table.Th>
                    <Table.Th>Selected VAT Type</Table.Th>
                    <Table.Th>Total amount</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {q.products?.map((product) => (
                    <ProductRow key={product.name + product.total_amount} product={product} />
                  ))}
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>

            <Box>
              <Text c="dimmed" size="sm">
                Grand total
              </Text>
              <Center>
                <Text size="xl" fw={700}>
                  <NumberFormatter
                    prefix="₱"
                    decimalScale={2}
                    thousandSeparator=","
                    value={q.grand_total}
                  />
                </Text>
              </Center>
            </Box>
          </Stack>
        </Card>
      </Stack>
    </Container>
  )
}
