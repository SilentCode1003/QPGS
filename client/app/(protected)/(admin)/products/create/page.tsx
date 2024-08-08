'use client'

import { useGetAllCategories } from '@/api/categories/all'
import { useCreateProduct } from '@/api/products/create'
import {
  Button,
  Container,
  Group,
  NativeSelect,
  NumberInput,
  Paper,
  Stack,
  TextInput,
  Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { IconPlus } from '@tabler/icons-react'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { zodResolver } from 'mantine-form-zod-resolver'
import DescriptionEditor from './_components/DescriptionEditor'
import { CreateProductInput, createProductSchema } from './schema'

const defaultCategories = [{ label: '', value: '' }]

const content = ''

export default function CreateProduct() {
  const form = useForm<CreateProductInput>({
    mode: 'uncontrolled',
    initialValues: {
      name: '',
      description: '',
      price: 0,
      category_id: '',
    },
    validate: zodResolver(createProductSchema),
  })

  const editor = useEditor({
    extensions: [StarterKit],
    immediatelyRender: false,
    content,
    editorProps: {
      attributes: {
        class: 'text-sm',
      },
    },
    onUpdate: (props) => {
      const content = editor?.isEmpty ? '' : props.editor.getHTML()

      form.setFieldValue('description', content)
    },
  })

  const { data: categories, isLoading: categoriesIsLoading } = useGetAllCategories()
  const transformedCategories = categories?.data.map((category) => ({
    label: category.name,
    value: category.id.toString(),
  }))

  const { mutateAsync: createProduct, isPending } = useCreateProduct()

  const handleSubmit = async (values: typeof form.values) => {
    try {
      await createProduct({ ...values, category_id: Number(values.category_id) })
      notifications.show({
        title: 'Success',
        message: 'Product successfully created',
        color: 'green',
      })
      editor?.commands.clearContent()
      form.reset()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <Title my={32}>Create Product</Title>

      <Container size="xs">
        <Paper withBorder p={30} mt={30} radius="md">
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
              <TextInput
                label="Name"
                placeholder="Product name"
                key={form.key('name')}
                {...form.getInputProps('name')}
              />

              <NumberInput
                label="Price"
                placeholder="Price"
                prefix="₱"
                decimalScale={2}
                fixedDecimalScale
                decimalSeparator="."
                thousandSeparator=","
                key={form.key('price')}
                {...form.getInputProps('price')}
              />

              <NativeSelect
                label="Category"
                data={
                  transformedCategories
                    ? defaultCategories.concat(transformedCategories)
                    : defaultCategories
                }
                key={form.key('category_id')}
                {...form.getInputProps('category_id')}
              />

              <DescriptionEditor form={form} editor={editor} />
            </Stack>

            <Group mt="xl" justify="end">
              <Button leftSection={<IconPlus size={16} />} type="submit" disabled={isPending}>
                Create
              </Button>
            </Group>
          </form>
        </Paper>
      </Container>
    </div>
  )
}
