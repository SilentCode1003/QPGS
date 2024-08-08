import { Paper, ScrollArea, Text } from '@mantine/core'
import { Payload } from './Review'
import ReviewProductItem from './ReviewProductItem'

export default function ReviewProducts({ payload }: { payload: Payload }) {
  return (
    <Paper withBorder p={30} m={30}>
      <Text fw={700} mb={16}>
        Products
      </Text>

      <ScrollArea scrollbars="x">
        {payload.products.map((qp) => (
          <ReviewProductItem key={qp.product_id} qp={qp} />
        ))}
      </ScrollArea>
    </Paper>
  )
}
