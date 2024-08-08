'use client'

import { useGetCategoryById } from '@/api/categories/get-by-id'
import SlugLoading from '@/components/SlugLoading'
import { formatDateTimeToMonthDateYearTime } from '@/utils/date'
import { Container, Paper, Stack, Text, Title } from '@mantine/core'

export default function CategoryInformation({ params }: { params: { id: string } }) {
  const { data, isLoading, isError } = useGetCategoryById(Number(params.id))
  const category = data?.data

  return (
    <div>
      <Title my={32}>Category Information</Title>

      <Container size="xs">
        <Paper withBorder p={30} mt={30} radius="md">
          {isError && <p>Category not found</p>}
          {isLoading ? (
            <SlugLoading />
          ) : (
            category && (
              <Stack>
                <Text size="lg" fw={700}>
                  Details
                </Text>

                <div>
                  <Text size="sm">Id</Text>
                  <Text>{category.id}</Text>
                </div>

                <div>
                  <Text size="sm">Name</Text>
                  <Text>{category.name}</Text>
                </div>

                {/* TODO: Create is_active component */}
                <div>
                  <Text size="sm">Is Active</Text>
                  <Text>{category.is_active.toString()}</Text>
                </div>

                <div>
                  <Text size="sm">Created At</Text>
                  <Text>{formatDateTimeToMonthDateYearTime(category.created_at)}</Text>
                </div>

                <div>
                  <Text size="sm">Updated At</Text>
                  <Text>{formatDateTimeToMonthDateYearTime(category.updated_at)}</Text>
                </div>
              </Stack>
            )
          )}
        </Paper>
      </Container>
    </div>
  )
}
