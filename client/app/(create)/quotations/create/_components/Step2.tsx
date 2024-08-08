import { useGetAllTermsAndConditions } from '@/api/terms-and-conditions/all'
import { Button, Container, Group, Paper, Select, Textarea, TextInput, Title } from '@mantine/core'
import { DatePickerInput, DatesProvider } from '@mantine/dates'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { zodResolver } from 'mantine-form-zod-resolver'
import { useEffect } from 'react'
import { z } from 'zod'

export const STEP2_LOCAL_STORAGE_KEY = 'qs-step-2' as const

const step2Schema = z.object({
  subject: z.string().trim().min(1, { message: 'Subject is required' }),
  date: z.date(),
  expiry_date: z.date(),
  note: z.string().trim().nullable(),
  terms_and_conditions: z.string().trim().min(1, { message: 'Terms and Conditions is required' }),
})

type Step2Input = z.infer<typeof step2Schema>

export default function Step2({
  nextStep,
  prevStep,
}: {
  nextStep: () => void
  prevStep: () => void
}) {
  const form = useForm<Step2Input>({
    mode: 'uncontrolled',
    initialValues: {
      subject: '',
      // @ts-ignore
      date: null,
      // @ts-ignore
      expiry_date: null,
      note: '',
      terms_and_conditions: '',
    },
    onValuesChange: (values) => {
      window.localStorage.setItem(STEP2_LOCAL_STORAGE_KEY, JSON.stringify(values))
    },
    validate: zodResolver(step2Schema),
  })

  const { data: termsAndConditions, isLoading: termsAndConditionsIsLoading } =
    useGetAllTermsAndConditions({ is_active: 'true' })
  const termsAndConditionsSelectData = termsAndConditions?.data.map((tac) => ({
    label: tac.summary,
    value: tac.id.toString(),
  }))

  const handleSubmit = (values: typeof form.values) => {
    nextStep()
  }

  const handleSelectChange = (value: string | null) => {
    const foundTermsAndConditions = termsAndConditions?.data.find((tac) => tac.id === Number(value))

    if (!foundTermsAndConditions) {
      notifications.show({
        title: 'Error',
        message: 'Terms and Conditions not found',
        color: 'red',
      })
      return
    }

    form.setValues({ terms_and_conditions: foundTermsAndConditions.body })
  }

  useEffect(() => {
    const storedValue = window.localStorage.getItem(STEP2_LOCAL_STORAGE_KEY)

    if (storedValue) {
      try {
        const parsedValues = JSON.parse(window.localStorage.getItem(STEP2_LOCAL_STORAGE_KEY)!)

        const transformedValues = {
          ...parsedValues,
          date: new Date(parsedValues.date),
          expiry_date: new Date(parsedValues.expiry_date),
        }

        form.setValues(transformedValues)
      } catch (error) {
        notifications.show({
          title: 'Error',
          message: 'Failed to parse stored value',
          color: 'red',
        })
      }
    }
  }, [])

  return (
    <div>
      <Container size="xs">
        <Paper withBorder p={30} mt={30} radius="md">
          <Title mb={36}>Quotation Information</Title>
          {/*@ts-ignore  */}
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <TextInput
              label="Subject"
              key={form.key('subject')}
              {...form.getInputProps('subject')}
            />

            <DatesProvider settings={{ firstDayOfWeek: 0 }}>
              <DatePickerInput
                label="Date"
                key={form.key('date')}
                {...form.getInputProps('date')}
              />

              <DatePickerInput
                label="Expiry Date"
                key={form.key('expiry_date')}
                {...form.getInputProps('expiry_date')}
              />
            </DatesProvider>

            <Textarea label="Notes" key={form.key('note')} {...form.getInputProps('note')} />

            <Select
              label="Select terms and conditions preset"
              data={termsAndConditionsSelectData || []}
              onChange={handleSelectChange}
            />

            <Textarea
              label="Terms and Conditions"
              key={form.key('terms_and_conditions')}
              {...form.getInputProps('terms_and_conditions')}
            />
            <Group mt={24} justify="end">
              <Button type="button" onClick={prevStep} variant="default">
                Back
              </Button>
              <Button type="submit">Next</Button>
            </Group>
          </form>
        </Paper>
      </Container>
    </div>
  )
}
