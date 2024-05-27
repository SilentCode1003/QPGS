import {
  Product,
  Step5Values,
} from '@/app/(root)/(quotations)/quotations/create/(steps)/step-5/page'
import { ActionIcon, Box, Group, NumberInput, Radio, Select, Stack, TextInput } from '@mantine/core'
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

  const [price, setPrice] = useState(form.getValues().products[index].price)
  const [duration, setDuration] = useState(form.getValues().products[index].duration)
  const [quantity, setQuantity] = useState(form.getValues().products[index].quantity)
  const [markup, setMarkup] = useState(form.getValues().products[index].markup)
  const [vatType, setVatType] = useState(form.getValues().products[index].vat_type)

  const vatExTotal = (markup / 100) * price + price
  const vatIncTotal = vatExTotal * 1.12
  const totalAmount =
    vatType === 'vatEx' ? vatExTotal * duration * quantity : vatIncTotal * duration * quantity

  form.watch(`products.${index}.name`, ({ value }) => {
    const product = mockProducts.find((product) => product.name === value)

    form.setFieldValue(`${currentItem}.description`, product?.description)
    form.setFieldValue(`${currentItem}.price`, product?.price)
  })

  form.watch(`${currentItem}.price`, ({ value }) => {
    setPrice(value as number)
  })
  form.watch(`${currentItem}.duration`, ({ value }) => {
    setDuration(value as number)
  })
  form.watch(`${currentItem}.quantity`, ({ value }) => {
    setQuantity(value as number)
  })
  form.watch(`${currentItem}.markup`, ({ value }) => {
    setMarkup(value as number)
  })
  form.watch(`${currentItem}.vat_type`, ({ value }) => {
    setVatType(value as 'vatEx' | 'vatInc')
  })

  useEffect(() => {
    form.setFieldValue(`${currentItem}.vatEx`, vatExTotal)
    form.setFieldValue(`${currentItem}.vatInc`, vatIncTotal)
  }, [form, currentItem, vatExTotal, vatIncTotal])

  useEffect(() => {
    form.setFieldValue(`${currentItem}.total_amount`, totalAmount)
  }, [form, currentItem, totalAmount])

  return (
    <Group key={item.key} wrap="nowrap">
      <Box miw={200} h={100}>
        <Select
          label="Product name"
          data={mockProductNames}
          searchable
          key={form.key(`${currentItem}.name`)}
          {...form.getInputProps(`${currentItem}.name`)}
        />
      </Box>

      <Box miw={200} h={100}>
        <TextInput
          disabled
          label="Description"
          key={form.key(`${currentItem}.description`)}
          {...form.getInputProps(`${currentItem}.description`)}
        />
      </Box>

      <Box miw={200} h={100}>
        <TextInput
          label="Payment type"
          key={form.key(`${currentItem}.payment_type`)}
          {...form.getInputProps(`${currentItem}.payment_type`)}
        />
      </Box>

      <Box miw={200} h={100}>
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
      </Box>

      <Box miw={200} h={100}>
        <NumberInput
          label="Markup"
          min={0}
          suffix="%"
          thousandSeparator=","
          key={form.key(`${currentItem}.markup`)}
          {...form.getInputProps(`${currentItem}.markup`)}
        />
      </Box>

      <Box miw={200} h={100}>
        <NumberInput
          disabled
          label="VAT Excluded"
          min={0}
          prefix="₱"
          thousandSeparator=","
          decimalScale={2}
          fixedDecimalScale
          key={form.key(`${currentItem}.vatEx`)}
          {...form.getInputProps(`${currentItem}.vatEx`)}
        />
      </Box>

      <Box miw={200} h={100}>
        <NumberInput
          disabled
          label="VAT Included"
          min={0}
          prefix="₱"
          thousandSeparator=","
          decimalScale={2}
          fixedDecimalScale
          key={form.key(`${currentItem}.vatInc`)}
          {...form.getInputProps(`${currentItem}.vatInc`)}
        />
      </Box>

      <Box miw={200} h={100}>
        <NumberInput
          label="Duration"
          min={0}
          thousandSeparator=","
          key={form.key(`${currentItem}.duration`)}
          {...form.getInputProps(`${currentItem}.duration`)}
        />
      </Box>

      <Box miw={200} h={100}>
        <NumberInput
          label="Quantity"
          min={0}
          thousandSeparator=","
          key={form.key(`${currentItem}.quantity`)}
          {...form.getInputProps(`${currentItem}.quantity`)}
        />
      </Box>

      <Box miw={200} h={100}>
        <Radio.Group
          label="VAT Type"
          key={form.key(`${currentItem}.vat_type`)}
          {...form.getInputProps(`${currentItem}.vat_type`)}
        >
          <Stack>
            <Radio value="vatEx" label="VAT Excluded" />
            <Radio value="vatInc" label="VAT Included" />
          </Stack>
        </Radio.Group>
      </Box>

      <Box miw={200} h={100}>
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
      </Box>

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
