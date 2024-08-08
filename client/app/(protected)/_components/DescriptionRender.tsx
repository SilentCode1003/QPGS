import { RichTextEditor } from '@mantine/tiptap'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

export default function DescriptionRender({ content }: { content: string }) {
  const editor = useEditor({
    extensions: [StarterKit],
    editable: false,
    content,
    immediatelyRender: false,
  })

  return (
    <RichTextEditor editor={editor}>
      <RichTextEditor.Content />
    </RichTextEditor>
  )
}
