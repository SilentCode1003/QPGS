'use client'
import { queryClient } from '@/app/components/AppProvider'
import ProductRow from '@/app/components/quotations/ProductRow'
import { api } from '@/app/lib/api'
import { useUser } from '@/app/lib/auth'
import { formatDate, formatDateWithoutTime, timeFromNow } from '@/app/utils/format'
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Center,
  Container,
  Group,
  NumberFormatter,
  Paper,
  SimpleGrid,
  Stack,
  Table,
  Text,
  Textarea,
  Title,
} from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { IconDownload } from '@tabler/icons-react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { z } from 'zod'
import { Product } from '../all/page'

interface Comment {
  id: string
  quotation_id: string
  body: string
  commenter_id: number
  commenter: {
    id: number
    first_name: string
    last_name: string
    role: {
      name: string
    }
  }
  created_at: string
  updated_at: string
}

interface Quotation {
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
  quotation_comment: Comment[]
}

interface QuotationResponse {
  data: Quotation
}

async function fetchQuotation(id: string) {
  const res = await api.get<QuotationResponse>(`/quotations/${encodeURIComponent(id)}`)
  return res.data.data
}

const schema = z.object({
  comment: z.string().min(1),
})

function useCreateComment(quotationId: string) {
  return useMutation({
    mutationFn: (data: { quotation_id: string; body: string; commenter_id: number }) => {
      return api.post('/comments', data)
    },
    onSuccess: async () => {
      notifications.show({
        title: 'Success',
        message: 'Successfully commented',
        color: 'green',
      })
      queryClient.invalidateQueries({
        queryKey: [`quotations/${quotationId}`],
      })
    },
    onError: (err) => {
      console.error(err)
      notifications.show({
        title: 'Error',
        message: 'Cannot submit comment',
        color: 'red',
      })
    },
  })
}

function useApproveQuotation(quotationId: string) {
  return useMutation({
    mutationFn: () => {
      return api.patch(`/quotations/${encodeURIComponent(quotationId)}/approve`)
    },
    onSuccess: async () => {
      notifications.show({
        title: 'Success',
        message: 'Successfully approved',
        color: 'green',
      })
      queryClient.invalidateQueries({
        queryKey: [`quotations/${quotationId}`],
      })
    },
    onError: (err) => {
      console.error(err)
      notifications.show({
        title: 'Error',
        message: 'Cannot approve quotation',
        color: 'red',
      })
    },
  })
}

export default function QuotationInfo({ params }: { params: { id: string } }) {
  // unstable_noStore()

  const user = useUser()

  const quotation = useQuery({
    queryKey: [`quotations/${params.id}`],
    queryFn: () => fetchQuotation(params.id),
    staleTime: 0,
  })

  const comment = useCreateComment(params.id)

  const approveMutation = useApproveQuotation(params.id)

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      comment: '',
    },
    validate: zodResolver(schema),
  })

  const approveQuotation = async () => {
    try {
      await approveMutation.mutateAsync()
    } catch (err) {}
  }

  if (!user.data) {
    return <span>Please refresh</span>
  }

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
              <SimpleGrid cols={2}>
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
              </SimpleGrid>
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
              Comments
            </Text>

            {q.quotation_comment.map((comment) => (
              <Paper key={comment.id} p="lg" withBorder radius="md">
                <Group>
                  <Avatar>{comment.commenter.first_name}</Avatar>
                  <Box>
                    <Text fz="sm">{`${comment.commenter.first_name} ${comment.commenter.last_name}`}</Text>
                    <Text fz="xs" c="dimmed">
                      {timeFromNow(new Date(comment.created_at))}
                    </Text>
                  </Box>
                </Group>

                <Text mt="lg">{comment.body}</Text>
              </Paper>
            ))}

            <form
              onSubmit={form.onSubmit(async (e) => {
                try {
                  comment.mutateAsync({
                    body: e.comment,
                    commenter_id: user.data.id,
                    quotation_id: params.id,
                  })
                  form.reset()
                } catch (err) {}
              })}
            >
              <Textarea
                label="Add comment"
                key={form.key('comment')}
                {...form.getInputProps('comment')}
              />
              <Button mt="xs" type="submit" disabled={comment.isPending}>
                Submit
              </Button>
            </form>
          </Stack>
        </Card>

        {q.quotation_status.name === 'pending' && (
          <Button size="compact-xl" onClick={approveQuotation}>
            Approve
          </Button>
        )}

        <Button
          rightSection={<IconDownload size={14} />}
          component="a"
          href={`${process.env.NEXT_PUBLIC_API_URL}/reports/report-${params.id}.docx`}
        >
          Download
        </Button>
      </Stack>
    </Container>
  )
}
