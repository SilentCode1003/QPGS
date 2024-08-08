import { Flex, Loader } from '@mantine/core'

export default function loading() {
  return (
    <Flex h="100vh" w="100vw" justify="center" align="center">
      <Loader size={200} type="dots" />
    </Flex>
  )
}
