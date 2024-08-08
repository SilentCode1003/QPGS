import { useGetAllCategories } from '@/api/categories/all'
import { Button, Container, Group, Paper, Text, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { zodResolver } from 'mantine-form-zod-resolver'
import { useEffect } from 'react'
import { z } from 'zod'

export const QS_STEP_NUMBER_LOCAL_STORAGE_KEY = 'qs-step-number' as const

export const STEP1_LOCAL_STORAGE_KEY = 'qs-step-1' as const

const step1Schema = z.object({
  category_id: z.string().trim().min(1, { message: 'Category is required' }),
})

type Step1Input = z.infer<typeof step1Schema>

export default function Step1({
  nextStep,
  prevStep,
}: {
  nextStep: () => void
  prevStep: () => void
}) {
  const form = useForm<Step1Input>({
    mode: 'uncontrolled',
    initialValues: {
      category_id: '',
    },
    onValuesChange: (values) => {
      window.localStorage.setItem(STEP1_LOCAL_STORAGE_KEY, JSON.stringify(values))
    },
    validate: zodResolver(step1Schema),
  })

  const { data: categories, isLoading: categoriesIsLoading } = useGetAllCategories({
    is_active: 'true',
  })

  const handleSubmit = (values: typeof form.values) => {
    nextStep()
  }

  const handleButtonClick = (id: string) => {
    form.setFieldValue('category_id', id)
  }

  useEffect(() => {
    const storedValue = window.localStorage.getItem(STEP1_LOCAL_STORAGE_KEY)

    if (storedValue) {
      try {
        form.setValues(JSON.parse(window.localStorage.getItem(STEP1_LOCAL_STORAGE_KEY)!))
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
      <Container size="lg">
        <Paper withBorder p={30} mt={30} radius="md">
          <Title>Select Category</Title>

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Group justify="center" py={100} gap="lg">
              {categories?.data.map((category) => (
                <Button
                  key={category.id}
                  type="button"
                  size="xl"
                  miw={150}
                  variant={
                    form.getValues().category_id === category.id.toString() ? 'filled' : 'default'
                  }
                  onClick={() => handleButtonClick(category.id.toString())}
                >
                  {category.name}
                </Button>
              ))}
            </Group>

            {form.errors['category_id'] && <Text c="red">Please select a category</Text>}

            <Group mt={24} justify="end">
              <Button type="submit">Next</Button>
            </Group>
          </form>
        </Paper>
      </Container>
    </div>
  )
}
