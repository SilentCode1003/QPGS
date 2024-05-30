'use client'
import { api } from '@/app/lib/api'
import { Button, Container, Input, NumberInput, Stack, TextInput, Title } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { RichTextEditor } from '@mantine/tiptap'
import { useMutation } from '@tanstack/react-query'
import Highlight from '@tiptap/extension-highlight'
import SubScript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { z } from 'zod'

const productSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(8, { message: 'Description is required' }),
  price: z.number().gt(0),
})

type ProductValues = z.infer<typeof productSchema>

type Product = {
  id: number
  name: string
  description: string
  price: string
  created_at: string
}

type CreateProductResponse = {
  data: Product
}

function useCreateProduct() {
  return useMutation({
    mutationFn: (data: ProductValues) => {
      return api.post<CreateProductResponse>('/products', data)
    },
    onSuccess: () => {
      notifications.show({
        title: 'Success',
        message: 'Product created succesfully',
        color: 'green',
      })
    },
    onError: (err) => {
      console.error(err)
      notifications.show({
        title: 'Error',
        message: 'Cannot create product',
        color: 'red',
      })
    },
  })
}

export default function CreateProductPage() {
  const productMutation = useCreateProduct()

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      name: '',
      description: '',
      price: '0',
    },
    validate: zodResolver(productSchema),
  })

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: '',
    onUpdate: (props) => {
      const content = props.editor.getHTML()
      form.setFieldValue('description', content)
    },
  })

  // @ts-ignore
  const handleSubmit = (values) => {
    productMutation.mutate(values)
    form.reset()
    editor?.commands.clearContent(true)
  }

  return (
    <Stack>
      <Title>Create product</Title>

      <Container size="sm">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput label="Name" key={form.key('name')} {...form.getInputProps('name')} />

            <Input.Wrapper label="Description" error={form.errors['description']}>
              <RichTextEditor editor={editor}>
                <RichTextEditor.Toolbar>
                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Bold />
                    <RichTextEditor.Italic />
                    <RichTextEditor.Underline />
                    <RichTextEditor.Strikethrough />
                    <RichTextEditor.ClearFormatting />
                    <RichTextEditor.Highlight />
                    <RichTextEditor.Code />
                  </RichTextEditor.ControlsGroup>

                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.H1 />
                    <RichTextEditor.H2 />
                    <RichTextEditor.H3 />
                    <RichTextEditor.H4 />
                  </RichTextEditor.ControlsGroup>

                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Blockquote />
                    <RichTextEditor.Hr />
                    <RichTextEditor.BulletList />
                    <RichTextEditor.OrderedList />
                    <RichTextEditor.Subscript />
                    <RichTextEditor.Superscript />
                  </RichTextEditor.ControlsGroup>

                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Link />
                    <RichTextEditor.Unlink />
                  </RichTextEditor.ControlsGroup>

                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.AlignLeft />
                    <RichTextEditor.AlignCenter />
                    <RichTextEditor.AlignJustify />
                    <RichTextEditor.AlignRight />
                  </RichTextEditor.ControlsGroup>

                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Undo />
                    <RichTextEditor.Redo />
                  </RichTextEditor.ControlsGroup>
                </RichTextEditor.Toolbar>

                <RichTextEditor.Content />
              </RichTextEditor>
            </Input.Wrapper>

            <NumberInput
              label="Price"
              key={form.key('price')}
              {...form.getInputProps('price')}
              prefix="₱"
              decimalScale={2}
              thousandSeparator=","
            />

            <Button type="submit">Submit</Button>
          </Stack>
        </form>
      </Container>
    </Stack>
  )
}
