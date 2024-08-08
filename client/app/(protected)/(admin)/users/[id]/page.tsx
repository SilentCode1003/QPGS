'use client'

import { useGetUserById } from '@/api/users/get-by-id'
import SlugLoading from '@/components/SlugLoading'
import { formatDateTimeToMonthDateYearTime } from '@/utils/date'
import { Container, Image, Paper, Stack, Text, Title } from '@mantine/core'

export default function UserInformation({ params }: { params: { id: string } }) {
  const { data, isLoading, isError } = useGetUserById(Number(params.id))
  const user = data?.data
  const fullName = user?.first_name + ' ' + user?.last_name

  return (
    <div>
      <Title my={32}>User Information</Title>

      <Container size="xs">
        <Paper withBorder p={30} mt={30} radius="md">
          {isError && <p>User not found</p>}
          {isLoading ? (
            <SlugLoading />
          ) : (
            user && (
              <Stack>
                <Text size="lg" fw={700}>
                  Details
                </Text>

                <div>
                  <Text size="sm">Id</Text>
                  <Text>{user.id}</Text>
                </div>

                <div>
                  <Text size="sm">First Name</Text>
                  <Text>{user.first_name}</Text>
                </div>

                <div>
                  <Text size="sm">Last Name</Text>
                  <Text>{user.last_name}</Text>
                </div>

                <div>
                  <Text size="sm">Email</Text>
                  <Text>{user.email}</Text>
                </div>

                <div>
                  <Text size="sm">Username</Text>
                  <Text>{user.username}</Text>
                </div>

                <div>
                  <Text size="sm">Role</Text>
                  <Text>{user.role.name}</Text>
                </div>

                <div>
                  <Text size="sm">Job Title</Text>
                  <Text>{user.job_title}</Text>
                </div>

                {/* TODO: make is_active component */}
                <div>
                  <Text size="sm">Is Active</Text>
                  <Text>{user.is_active.toString()}</Text>
                </div>

                <div>
                  <Text size="sm">Created At</Text>
                  <Text>{formatDateTimeToMonthDateYearTime(user.created_at)}</Text>
                </div>

                <div>
                  <Text size="sm">Updated At</Text>
                  <Text>{formatDateTimeToMonthDateYearTime(user.updated_at)}</Text>
                </div>

                <div>
                  <Text size="sm">Signature</Text>
                  {user.signature ? (
                    <Image src={user.signature} alt={`${fullName}'s signature`} />
                  ) : (
                    <Text c="dimmed">Empty</Text>
                  )}
                </div>
              </Stack>
            )
          )}
        </Paper>
      </Container>
    </div>
  )
}
