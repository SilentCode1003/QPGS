import {
  Product,
  Step5Values,
} from '@/app/(root)/(quotations)/quotations/create/(steps)/step-5/page'
import { ActionIcon, Group, NumberInput, Select, TextInput } from '@mantine/core'
import { UseFormReturnType } from '@mantine/form'
import { IconTrash } from '@tabler/icons-react'
import { useEffect, useState } from 'react'

interface Props {
  form: UseFormReturnType<Step5Values>
  item: Product
  index: number
}

const mockProducts = [
  {
    id: 1,
    name: 'POS',
    description: 'Point of sales',
    price: 99.99,
  },
  {
    id: 2,
    name: 'Quotation System',
    description: 'Web app',
    price: 1_000_000,
  },
]

const mockProductNames = mockProducts.map((product) => product.name)

export default function ProductItem({ form, item, index }: Props) {
  const currentItem = `products.${index}`

  const [price, setPrice] = useState(0)
  const [duration, setDuration] = useState(0)
  const [quantity, setQuantity] = useState(0)

  form.watch(`products.${index}.name`, ({ value }) => {
    const product = mockProducts.find((product) => product.name === value)

    form.setFieldValue(`${currentItem}.description`, product?.description)
    form.setFieldValue(`${currentItem}.price`, product?.price)
  })

  const totalAmount = price * duration * quantity

  useEffect(() => {
    form.setFieldValue(`${currentItem}.total_amount`, totalAmount)
  }, [totalAmount, form, currentItem])

  form.watch(`${currentItem}.price`, ({ value }) => {
    setPrice(value as number)
  })
  form.watch(`${currentItem}.duration`, ({ value }) => {
    setDuration(value as number)
  })
  form.watch(`${currentItem}.quantity`, ({ value }) => {
    setQuantity(value as number)
  })

  return (
    <Group key={item.key}>
      <Select
        label="Product name"
        data={mockProductNames}
        searchable
        key={form.key(`${currentItem}.name`)}
        {...form.getInputProps(`${currentItem}.name`)}
      />

      <TextInput
        disabled
        label="Description"
        key={form.key(`${currentItem}.description`)}
        {...form.getInputProps(`${currentItem}.description`)}
      />

      <TextInput
        label="Payment type"
        key={form.key(`${currentItem}.payment_type`)}
        {...form.getInputProps(`${currentItem}.payment_type`)}
      />

      <NumberInput
        disabled
        label="Price"
        prefix="₱"
        thousandSeparator=","
        decimalScale={2}
        fixedDecimalScale
        key={form.key(`${currentItem}.price`)}
        {...form.getInputProps(`${currentItem}.price`)}
      />

      <NumberInput
        label="Duration"
        min={0}
        thousandSeparator=","
        key={form.key(`${currentItem}.duration`)}
        {...form.getInputProps(`${currentItem}.duration`)}
      />

      <NumberInput
        label="Quantity"
        min={0}
        thousandSeparator=","
        key={form.key(`${currentItem}.quantity`)}
        {...form.getInputProps(`${currentItem}.quantity`)}
      />

      <NumberInput
        disabled
        label="Total amount"
        min={0}
        prefix="₱"
        thousandSeparator=","
        decimalScale={2}
        fixedDecimalScale
        key={form.key(`${currentItem}.total_amount`)}
        {...form.getInputProps(`${currentItem}.total_amount`)}
      />

      <ActionIcon
        color="red"
        onClick={() => form.removeListItem('products', index)}
        disabled={form.getValues().products.length === 1}
      >
        <IconTrash size="1rem" />
      </ActionIcon>
    </Group>
  )
}
