import { Product } from '@/app/(root)/(app)/quotations/all/page'
import { NumberFormatter, Table } from '@mantine/core'
import { RichTextEditor } from '@mantine/tiptap'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

export default function ProductRow({ product }: { product: Product }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: product.description,
    editable: false,
  })

  return (
    <Table.Tr>
      <Table.Td>{product.name}</Table.Td>
      <Table.Td miw={300}>
        <RichTextEditor editor={editor} style={{ border: '0px' }}>
          <RichTextEditor.Content />
        </RichTextEditor>
      </Table.Td>
      <Table.Td>{product.payment_type}</Table.Td>
      <Table.Td>
        <NumberFormatter prefix="₱" decimalScale={2} thousandSeparator="," value={product.price} />
      </Table.Td>
      <Table.Td>
        <NumberFormatter suffix="%" decimalScale={2} thousandSeparator="," value={product.markup} />
      </Table.Td>
      <Table.Td>
        <NumberFormatter prefix="₱" decimalScale={2} thousandSeparator="," value={product.vat_ex} />
      </Table.Td>
      <Table.Td>
        <NumberFormatter
          prefix="₱"
          decimalScale={2}
          thousandSeparator=","
          value={product.vat_inc}
        />
      </Table.Td>
      <Table.Td>
        <NumberFormatter thousandSeparator="," value={product.duration} />
      </Table.Td>
      <Table.Td>
        <NumberFormatter thousandSeparator="," value={product.quantity} />
      </Table.Td>
      <Table.Td>{product.vat_type}</Table.Td>
      <Table.Td>
        <NumberFormatter
          prefix="₱"
          decimalScale={2}
          thousandSeparator=","
          value={product.total_amount}
        />
      </Table.Td>
    </Table.Tr>
  )
}
