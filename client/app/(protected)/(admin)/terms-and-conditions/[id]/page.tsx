'use client'

import { useGetTermsAndConditionsById } from '@/api/terms-and-conditions/get-by-id'
import SlugLoading from '@/components/SlugLoading'
import { formatDateTimeToMonthDateYearTime } from '@/utils/date'
import { Container, Paper, Stack, Text, Title } from '@mantine/core'

export default function TermsAndConditionsInformation({ params }: { params: { id: string } }) {
  const { data, isLoading, isError } = useGetTermsAndConditionsById(Number(params.id))
  const termsAndCondition = data?.data

  return (
    <div>
      <Title my={32}>Terms and Conditions Preset Information</Title>

      <Container size="xs">
        <Paper withBorder p={30} mt={30} radius="md">
          {isError && <p>Terms and Conditions preset not found</p>}
          {isLoading ? (
            <SlugLoading />
          ) : (
            termsAndCondition && (
              <Stack>
                <Text size="lg" fw={700}>
                  Details
                </Text>

                <div>
                  <Text size="sm">Id</Text>
                  <Text>{termsAndCondition.id}</Text>
                </div>

                <div>
                  <Text size="sm">Summary</Text>
                  <Text>{termsAndCondition.summary}</Text>
                </div>

                <div>
                  <Text size="sm">Body</Text>
                  <Text>{termsAndCondition.body}</Text>
                </div>

                <div>
                  <Text size="sm">Is Active</Text>
                  <Text>{termsAndCondition.is_active.toString()}</Text>
                </div>

                <div>
                  <Text size="sm">Created At</Text>
                  <Text>{formatDateTimeToMonthDateYearTime(termsAndCondition.created_at)}</Text>
                </div>

                <div>
                  <Text size="sm">Updated At</Text>
                  <Text>{formatDateTimeToMonthDateYearTime(termsAndCondition.updated_at)}</Text>
                </div>
              </Stack>
            )
          )}
        </Paper>
      </Container>
    </div>
  )
}
