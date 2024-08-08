import { useGetClientById } from '@/api/clients/get-by-id'
import { Paper, Text } from '@mantine/core'
import { Payload } from './Review'

export default function ReviewClient({ payload }: { payload: Payload }) {
  const { data: client, isLoading: clientIsLoading } = useGetClientById(Number(payload.client_id))

  return (
    <Paper withBorder p={30} m={30}>
      <Text fw={700} mb={16}>
        Client
      </Text>

      <div>
        <Text>Client Name</Text>
        <Text>{client?.data.name}</Text>
      </div>

      <div>
        <Text>Telephone No.</Text>
        {client?.data.tel_no ? <Text>{client?.data.tel_no}</Text> : <Text c="dimmed">Empty</Text>}
      </div>

      <div>
        <Text>Contact No.</Text>
        <Text>{client?.data.contact_no}</Text>
      </div>

      <div>
        <Text>Email</Text>
        <Text>{client?.data.email}</Text>
      </div>

      <div>
        <Text>Address</Text>
        <Text>{client?.data.address}</Text>
      </div>
    </Paper>
  )
}
