'use client'

import { useGetProductById } from '@/api/products/get-by-id'
import SlugLoading from '@/components/SlugLoading'
import { formatDateTimeToMonthDateYearTime } from '@/utils/date'
import { Container, NumberFormatter, Paper, Stack, Text, Title } from '@mantine/core'
import DescriptionRender from '../../../_components/DescriptionRender'

export default function ProductInformation({ params }: { params: { id: string } }) {
  const { data, isLoading, isError } = useGetProductById(Number(params.id))
  const product = data?.data

  return (
    <div>
      <Title my={32}>Product Information</Title>

      <Container size="xs">
        <Paper withBorder p={30} mt={30} radius="md">
          {isError && <p>Product not found</p>}
          {isLoading ? (
            <SlugLoading />
          ) : (
            product && (
              <Stack>
                <Text size="lg" fw={700}>
                  Details
                </Text>

                <div>
                  <Text size="sm">Id</Text>
                  <Text>{product.id}</Text>
                </div>

                <div>
                  <Text size="sm">Name</Text>
                  <Text>{product.name}</Text>
                </div>

                <div>
                  <Text size="sm">Description</Text>
                  <DescriptionRender content={product.description} />
                </div>

                <div>
                  <Text size="sm">Price</Text>
                  <NumberFormatter
                    prefix="₱"
                    value={product.price}
                    thousandSeparator=","
                    decimalSeparator="."
                    decimalScale={2}
                  />
                </div>

                <div>
                  <Text size="sm">Category</Text>
                  <Text>{product.category.name}</Text>
                </div>

                {/* TODO: create is_active component */}
                <div>
                  <Text size="sm">Is Active</Text>
                  <Text>{product.is_active.toString()}</Text>
                </div>

                <div>
                  <Text size="sm">Created At</Text>
                  <Text>{formatDateTimeToMonthDateYearTime(product.created_at)}</Text>
                </div>

                <div>
                  <Text size="sm">Updated At</Text>
                  <Text>{formatDateTimeToMonthDateYearTime(product.updated_at)}</Text>
                </div>
              </Stack>
            )
          )}
        </Paper>
      </Container>
    </div>
  )
}
