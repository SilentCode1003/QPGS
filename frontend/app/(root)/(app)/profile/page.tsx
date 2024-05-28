'use client'
import { formatDate } from '@/app/utils/format'
import { Avatar, Box, Card, Center, Divider, SimpleGrid, Stack, Text, Title } from '@mantine/core'

type Profile = {
  id: number
  first_name: string
  last_name: string
  username: string
  email: string
  created_at: string
  updated_at: string
  role: 'ADMIN' | 'DEVELOPER' | 'USER'
}

const mockProfileData: Profile = {
  id: 1,
  first_name: 'John',
  last_name: 'Doe',
  username: 'admin',
  email: 'johndoe@example.com',
  created_at: '2024-05-25T08:29:00.579Z',
  updated_at: '2024-05-25T08:29:00.579Z',
  role: 'ADMIN',
}

export default function Profile() {
  // if (isPending) {
  //   return <div>Profile page loading...</div>
  // }

  // if (isError) {
  //   return <span>{JSON.stringify(error)}</span>
  // }

  return (
    <Stack>
      <Title>Profile</Title>

      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
        <Box>
          <SimpleGrid cols={{ base: 2, sm: 1 }}>
            <Center>
              <Avatar size={200}>{mockProfileData.first_name}</Avatar>
            </Center>

            <Stack gap={0} justify="center">
              <Text size="xl" fw={700} truncate="end">
                {mockProfileData.first_name + ' ' + mockProfileData.last_name}
              </Text>
              <Text size="xl" fw={300} c="dimmed" truncate="end">
                {mockProfileData.username}
              </Text>
            </Stack>
          </SimpleGrid>
        </Box>

        <Box>
          <Card shadow="sm" px="xl" py="lg">
            <Stack>
              <Text size="xl" fw={500}>
                User information
              </Text>

              <Divider />

              <Box>
                <Text size="sm" c="dimmed">
                  Id
                </Text>
                <Text truncate="end">{mockProfileData.id}</Text>
              </Box>

              <Box>
                <Text size="sm" c="dimmed">
                  First name
                </Text>
                <Text truncate="end">{mockProfileData.first_name}</Text>
              </Box>

              <Box>
                <Text size="sm" c="dimmed">
                  Last name
                </Text>
                <Text truncate="end">{mockProfileData.last_name}</Text>
              </Box>

              <Box>
                <Text size="sm" c="dimmed">
                  Username
                </Text>
                <Text truncate="end">{mockProfileData.username}</Text>
              </Box>

              <Box>
                <Text size="sm" c="dimmed">
                  Email
                </Text>
                <Text truncate="end">{mockProfileData.email}</Text>
              </Box>

              <Box>
                <Text size="sm" c="dimmed">
                  Role
                </Text>
                <Text>{mockProfileData.role}</Text>
              </Box>

              <Box>
                <Text size="sm" c="dimmed">
                  Created at
                </Text>
                <Text truncate="end">{formatDate(new Date(mockProfileData.created_at))}</Text>
              </Box>

              <Box>
                <Text size="sm" c="dimmed">
                  Updated at
                </Text>
                <Text truncate="end">{formatDate(new Date(mockProfileData.updated_at))}</Text>
              </Box>
            </Stack>
          </Card>
        </Box>
      </SimpleGrid>
    </Stack>
  )
}
