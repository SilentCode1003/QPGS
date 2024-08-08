import { formatDateTimeToMonthDateYear } from '@/utils/date'
import { Paper, Text } from '@mantine/core'
import { Payload } from './Review'

export default function ReviewInformation({ payload }: { payload: Payload }) {
  return (
    <Paper withBorder p={30} m={30}>
      <Text fw={700} mb={16}>
        Information
      </Text>

      <div>
        <Text>Subject</Text>
        <Text>{payload.subject}</Text>
      </div>

      <div>
        <Text>Date</Text>
        <Text>{formatDateTimeToMonthDateYear(payload.date)}</Text>
      </div>

      <div>
        <Text>Expiry Date</Text>
        <Text>{formatDateTimeToMonthDateYear(payload.expiry_date)}</Text>
      </div>

      <div>
        <Text>Notes</Text>
        {payload.note ? <Text>{payload.note}</Text> : <Text c="dimmed">Empty</Text>}
      </div>

      <div>
        <Text>Terms and Condition</Text>
        <Text>{payload.terms_and_conditions}</Text>
      </div>
    </Paper>
  )
}
