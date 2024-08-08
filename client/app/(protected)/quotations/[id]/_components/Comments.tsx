import { useGetComments } from '@/api/comments/all'
import { useCreateComment } from '@/api/comments/create'
import { formatDateTimeToMonthDateYearTime, formatDateToFromNow } from '@/utils/date'
import {
  ActionIcon,
  Avatar,
  Container,
  Flex,
  Paper,
  rem,
  Skeleton,
  Text,
  Textarea,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { IconSend } from '@tabler/icons-react'
import { zodResolver } from 'mantine-form-zod-resolver'
import { z } from 'zod'

const createCommentSchema = z.object({
  body: z.string().trim().min(1, { message: 'Body is required' }),
})

type CreateCommentInput = z.infer<typeof createCommentSchema>

export default function Comments({ quotationId }: { quotationId: string }) {
  const form = useForm<CreateCommentInput>({
    mode: 'uncontrolled',
    initialValues: {
      body: '',
    },
    validate: zodResolver(createCommentSchema),
  })

  const { data, isLoading } = useGetComments(Number(quotationId), { is_active: 'true' })

  const { mutateAsync: createComment, isPending } = useCreateComment(Number(quotationId))

  const handleSubmit = async (values: typeof form.values) => {
    try {
      await createComment(values)
      notifications.show({
        title: 'Success',
        message: 'Comment successfully created',
        color: 'green',
      })
      form.reset()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      {isLoading && (
        <Container size="xs">
          <Paper p={8} m={30} withBorder radius="md">
            <Skeleton h={28} />
          </Paper>
        </Container>
      )}
      {data?.data.length !== 0 &&
        data?.data.map((comment) => (
          <Container key={comment.id} size="xs">
            <Paper p={8} m={30} withBorder radius="md">
              <Flex gap={16}>
                <Avatar
                  name={`${comment.commenter_user.first_name} ${comment.commenter_user.last_name}`}
                  color="initials"
                />

                <Flex direction="column" flex="1">
                  <Flex gap={8}>
                    <Text size="xs">{`${comment.commenter_user.first_name} ${comment.commenter_user.last_name}`}</Text>
                    <Text
                      size="xs"
                      c="dimmed"
                      title={formatDateTimeToMonthDateYearTime(comment.updated_at)}
                    >
                      {formatDateToFromNow(comment.created_at)}{' '}
                      {comment.created_at !== comment.updated_at && <span>(edited)</span>}
                    </Text>
                  </Flex>

                  {/* <Text size="sm">{comment.body}</Text> */}
                  <Textarea variant="unstyled" autosize value={comment.body} />
                </Flex>
              </Flex>
            </Paper>
          </Container>
        ))}

      <Container size="xs">
        <Paper p={8} m={30} withBorder radius="md">
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Flex align="end" gap={8}>
              <Textarea
                flex="1"
                autosize
                minRows={2}
                placeholder="Add a comment..."
                key={form.key('body')}
                {...form.getInputProps('body')}
              />

              <ActionIcon type="submit">
                <IconSend style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
              </ActionIcon>
            </Flex>
          </form>
        </Paper>
      </Container>
    </>
  )
}
