'use client'
import { LOCAL_STORAGE_KEY, useStepper } from '@/app/contexts/stepper'
import { api } from '@/app/lib/api'
import {
  Box,
  Button,
  Center,
  Container,
  Select,
  Stack,
  TextInput,
  Textarea,
  Title,
} from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { useForm, zodResolver } from '@mantine/form'
import { readLocalStorageValue } from '@mantine/hooks'
import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'

const step2Schema = z.object({
  subject: z.string().min(3),
  date: z.date(),
  expiry_date: z.date(),
  notes: z.string().optional(),
  terms_and_conditions: z.string().min(3),
})

export type Step2Values = z.infer<typeof step2Schema>

export default function Step2() {
  const { data: termsAndConditions } = useGetTermsAndConditions()
  const selectData = termsAndConditions?.map((tac) => tac.summary)

  const { updateData, incrementActive } = useStepper()

  const storageValues = readLocalStorageValue<Step2Values | undefined>({ key: LOCAL_STORAGE_KEY })

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      ...storageValues,
      date: storageValues?.date ? new Date(storageValues.date) : undefined,
      expiry_date: storageValues?.expiry_date ? new Date(storageValues.expiry_date) : undefined,
    },
    validate: zodResolver(step2Schema),
  })

  // @ts-ignore
  const onSubmit = (values) => {
    updateData(values)
    incrementActive()
  }

  const onPresetChange = (e: string | null) => {
    const preset = termsAndConditions?.find((preset) => preset.summary === e)
    form.setFieldValue('terms_and_conditions', preset?.body)
  }

  return (
    <Container size="sm">
      <Center>
        <Title>Enter quotations details</Title>
      </Center>

      <Box mt={50}>
        <form onSubmit={form.onSubmit(onSubmit)}>
          <Stack>
            <TextInput
              withAsterisk
              label="Subject"
              key={form.key('subject')}
              {...form.getInputProps('subject')}
            />

            <DatePickerInput
              withAsterisk
              label="Date"
              key={form.key('date')}
              {...form.getInputProps('date')}
            />

            <DatePickerInput
              withAsterisk
              label="Expiry date"
              key={form.key('expiry_date')}
              {...form.getInputProps('expiry_date')}
            />

            <Textarea
              autosize
              minRows={2}
              maxRows={5}
              label="Notes"
              key={form.key('notes')}
              {...form.getInputProps('notes')}
            />

            <Select
              label="Select terms and conditions preset"
              data={selectData}
              onChange={onPresetChange}
            />

            <Textarea
              autosize
              minRows={5}
              maxRows={10}
              withAsterisk
              label="Terms and conditions"
              key={form.key('terms_and_conditions')}
              {...form.getInputProps('terms_and_conditions')}
            />

            <Button type="submit">Next</Button>
          </Stack>
        </form>
      </Box>
    </Container>
  )
}

type TermsAndConditions = {
  id: number
  summary: string
  body: string
  created_at: string
  updated_at: string
}

type TermsAndConditionsResponse = {
  data: TermsAndConditions[]
}

function useGetTermsAndConditions() {
  return useQuery({
    queryKey: ['terms_and_conditions'],
    queryFn: async () => {
      const res = await api.get<TermsAndConditionsResponse>('/terms-and-conditions')
      return res.data.data
    },
  })
}
