import { useGetCategoryById } from '@/api/categories/get-by-id'
import { Paper, Text } from '@mantine/core'
import { Payload } from './Review'

export default function ReviewCategory({ payload }: { payload: Payload }) {
  const { data: category, isLoading: categoryIsLoading } = useGetCategoryById(
    Number(payload.category_id)
  )

  return (
    <Paper withBorder p={30} m={30}>
      <Text fw={700} mb={16}>
        Category
      </Text>

      <div>
        <Text>Category</Text>
        <Text>{category?.data.name}</Text>
      </div>
    </Paper>
  )
}
