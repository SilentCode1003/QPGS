import { Flex, Loader } from '@mantine/core'

export default function TableLoading() {
  return (
    <Flex justify="center">
      <Loader size={40} />
    </Flex>
  )
}
