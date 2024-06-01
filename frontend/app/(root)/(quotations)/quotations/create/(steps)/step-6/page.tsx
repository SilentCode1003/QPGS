'use client'
import ProductRow from '@/app/components/quotations/ProductRow'
import { Values, useStepper } from '@/app/contexts/stepper'
import { api } from '@/app/lib/api'
import { formatDateWithoutTime } from '@/app/utils/format'
import {
  Box,
  Button,
  Card,
  Center,
  Container,
  NumberFormatter,
  Stack,
  Table,
  Text,
  Textarea,
  Title,
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Step7() {
  const [clicked, setClicked] = useState(false)

  const router = useRouter()

  const mutation = useCreateQuotation()

  const { data, removeData, removeActive, removeHighest } = useStepper()

  const submitQuotation = async () => {
    try {
      setClicked(true)
      // Data should be complete here
      // @ts-ignore
      const res = await mutation.mutateAsync(data)
      // Clear all localstorage values
      router.push('/dashboard')
    } catch (err) {
      setClicked(false)
      // Do nothing because notification should show (onError)
      return
    }
    removeData()
    removeActive()
    removeHighest()
  }

  return (
    <Container size="sm">
      <Center>
        <Title>Review your quotation</Title>
      </Center>

      <Stack gap="lg" mt={50}>
        <Card shadow="sm" radius="xl" p="lg">
          <Stack>
            <Text size="lg" fw={700}>
              Quotation Information
            </Text>

            <Box>
              <Text c="dimmed" size="sm">
                Product type
              </Text>
              <Text size="lg">{data.type}</Text>
            </Box>

            <Box>
              <Text c="dimmed" size="sm">
                Subject
              </Text>
              <Text size="lg">{data.subject}</Text>
            </Box>

            <Box>
              <Text c="dimmed" size="sm">
                Date
              </Text>
              <Text size="lg">{formatDateWithoutTime(new Date(data.date!))}</Text>
            </Box>

            <Box>
              <Text c="dimmed" size="sm">
                Expiry Date
              </Text>
              <Text size="lg">{formatDateWithoutTime(new Date(data.expiry_date!))}</Text>
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
                value={data.note || 'N/A'}
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
                value={data.terms_and_conditions}
              />
            </Box>
          </Stack>
        </Card>

        <Card shadow="sm" radius="xl" p="lg">
          <Stack>
            <Text size="lg" fw={700}>
              Client Information
            </Text>

            <Box>
              <Text c="dimmed" size="sm">
                Client name
              </Text>
              <Text size="lg">{data.client?.name}</Text>
            </Box>

            <Box>
              <Text c="dimmed" size="sm">
                Telephone no.
              </Text>
              <Text size="lg">{data.client?.tel_no || 'N/A'}</Text>
            </Box>

            <Box>
              <Text c="dimmed" size="sm">
                Contact no.
              </Text>
              <Text size="lg">{data.client?.contact_no}</Text>
            </Box>

            <Box>
              <Text c="dimmed" size="sm">
                Email
              </Text>
              <Text size="lg">{data.client?.email}</Text>
            </Box>

            <Box>
              <Text c="dimmed" size="sm">
                Address
              </Text>
              <Text size="lg">{data.client?.address}</Text>
            </Box>
          </Stack>
        </Card>

        <Card shadow="sm" radius="xl" p="lg">
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
                  {data.products?.map((product) => (
                    <ProductRow key={product.key} product={product} />
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
                    value={data.grand_total}
                  />
                </Text>
              </Center>
            </Box>
          </Stack>
        </Card>

        <Button onClick={submitQuotation} disabled={clicked}>
          Submit
        </Button>
      </Stack>
    </Container>
  )
}

function useCreateQuotation() {
  return useMutation({
    mutationFn: (data: Values) => {
      return api.post('/quotations', data)
    },
    onSuccess: () => {
      notifications.show({
        title: 'Success',
        message: 'Quotation request successfully submitted',
        color: 'green',
      })
    },
    onError: (err) => {
      console.error(err)
      notifications.show({
        title: 'Error',
        message: 'Cannot submit quotation request',
        color: 'red',
      })
    },
  })
}
