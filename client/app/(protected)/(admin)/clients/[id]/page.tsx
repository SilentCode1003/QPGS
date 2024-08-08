'use client'

import { useGetClientById } from '@/api/clients/get-by-id'
import SlugLoading from '@/components/SlugLoading'
import { formatDateTimeToMonthDateYearTime } from '@/utils/date'
import { Container, Paper, Stack, Text, Title } from '@mantine/core'

export default function ClientInformation({ params }: { params: { id: string } }) {
  const { data, isLoading, isError } = useGetClientById(Number(params.id))
  const client = data?.data

  return (
    <div>
      <Title my={32}>Client Information</Title>

      <Container size="xs">
        <Paper withBorder p={30} mt={30} radius="md">
          {isError && <p>Client not found</p>}
          {isLoading ? (
            <SlugLoading />
          ) : (
            client && (
              <Stack>
                <Text size="lg" fw={700}>
                  Details
                </Text>

                <div>
                  <Text size="sm">Id</Text>
                  <Text>{client.id}</Text>
                </div>

                <div>
                  <Text size="sm">Name</Text>
                  <Text>{client.name}</Text>
                </div>

                <div>
                  <Text size="sm">Telephone No.</Text>
                  {client.tel_no ? <Text>{client.tel_no}</Text> : <Text c="dimmed">Empty</Text>}
                </div>

                <div>
                  <Text size="sm">Contact No.</Text>
                  <Text>{client.contact_no}</Text>
                </div>

                <div>
                  <Text size="sm">Email</Text>
                  <Text>{client.email}</Text>
                </div>

                <div>
                  <Text size="sm">Address</Text>
                  <Text>{client.address}</Text>
                </div>

                {/* TODO: Create created_by component */}
                <div>
                  <Text size="sm">Created By</Text>
                  <Text>
                    {client.created_by_user.first_name + ' ' + client.created_by_user.last_name}
                  </Text>
                </div>

                {/* TODO: Create is_active component */}
                <div>
                  <Text size="sm">Is Active</Text>
                  <Text>{client.is_active.toString()}</Text>
                </div>

                <div>
                  <Text size="sm">Updated At</Text>
                  <Text>{formatDateTimeToMonthDateYearTime(client.created_at)}</Text>
                </div>

                <div>
                  <Text size="sm">Updated At</Text>
                  <Text>{formatDateTimeToMonthDateYearTime(client.updated_at)}</Text>
                </div>
              </Stack>
            )
          )}
        </Paper>
      </Container>
    </div>
  )
}
