import { Skeleton } from '@mantine/core'

export default function SlugLoading() {
  return (
    <div>
      {Array(10)
        .fill(0)
        .map((_, index) => (
          <Skeleton key={index} h={28} my="md" />
        ))}
    </div>
  )
}
