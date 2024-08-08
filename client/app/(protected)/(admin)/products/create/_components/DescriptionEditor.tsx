'use client'

import { Input } from '@mantine/core'
import { UseFormReturnType } from '@mantine/form'
import { RichTextEditor } from '@mantine/tiptap'
import { CreateProductInput } from '../schema'
import { Editor } from '@tiptap/react'

export default function DescriptionEditor({
  form,
  editor,
}: {
  form: UseFormReturnType<CreateProductInput>
  editor: Editor | null
}) {
  return (
    <Input.Wrapper label="Description" error={form.errors.description}>
      <RichTextEditor editor={editor}>
        <RichTextEditor.Toolbar>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.BulletList />
            <RichTextEditor.OrderedList />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Undo />
            <RichTextEditor.Redo />
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>

        <RichTextEditor.Content />
      </RichTextEditor>
    </Input.Wrapper>
  )
}
