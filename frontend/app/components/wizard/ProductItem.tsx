import {
  Product,
  Step4Values,
} from '@/app/(root)/(quotations)/quotations/create/(steps)/step-4/page'
import { api } from '@/app/lib/api'
import { ActionIcon, Box, Group, NumberInput, Radio, Select, Stack, TextInput } from '@mantine/core'
import { UseFormReturnType } from '@mantine/form'
import { IconTrash } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

interface Props {
  form: UseFormReturnType<Step4Values>
  item: Product
  index: number
}

type ProductType = {
  id: number
  name: string
  description: string
  price: string
  created_at: string
}

type ProductsResponse = {
  data: ProductType[]
}

function useGetProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await api.get<ProductsResponse>('/products')
      return res.data.data
    },
    staleTime: 0,
  })
}

type PaymentType = {
  id: string
  name: string
  created_at: string
}

type PaymentTypesResponse = {
  data: PaymentType[]
}

function useGetPaymentTypes() {
  return useQuery({
    queryKey: ['payment_types'],
    queryFn: async () => {
      const res = await api.get<PaymentTypesResponse>('/payment-types')
      return res.data.data
    },
  })
}

export default function ProductItem({ form, item, index }: Props) {
  const { data: paymentTypes, isLoading, isError, error } = useGetPaymentTypes()
  const products = useGetProducts()
  const selectData = products.data?.map((product) => product.name)

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
    const product = products.data?.find((product) => product.name === value)

    form.setFieldValue(`${currentItem}.description`, product?.description)
    form.setFieldValue(`${currentItem}.price`, Number(product?.price))
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

  const [durationShouldDisable, setDurationShouldDisable] = useState(
    () => form.getValues().products[index].payment_type === 'One-time',
  )

  form.watch(`${currentItem}.payment_type`, ({ value }) => {
    // TODO: make this a config
    if (value === 'One-time') {
      form.setFieldValue(`${currentItem}.duration`, 1)
      setDurationShouldDisable(true)
    } else {
      setDurationShouldDisable(false)
    }
  })

  useEffect(() => {
    form.setFieldValue(`${currentItem}.vat_ex`, vatExTotal)
    form.setFieldValue(`${currentItem}.vat_inc`, vatIncTotal)
  }, [form, currentItem, vatExTotal, vatIncTotal])

  useEffect(() => {
    form.setFieldValue(`${currentItem}.total_amount`, totalAmount)
  }, [form, currentItem, totalAmount])

  if (isLoading) {
    return <span>Payment type is loading...</span>
  }

  if (products.isLoading) {
    return <span>Products are loading...</span>
  }

  return (
    <Group key={item.key} wrap="nowrap">
      <Box miw={200} h={100}>
        <Select
          label="Product name"
          data={selectData}
          searchable
          nothingFoundMessage="Nothing found..."
          key={form.key(`${currentItem}.name`)}
          {...form.getInputProps(`${currentItem}.name`)}
        />
      </Box>

      <Box miw={200} h={100}>
        <TextInput
          readOnly
          label="Description"
          key={form.key(`${currentItem}.description`)}
          {...form.getInputProps(`${currentItem}.description`)}
        />
      </Box>

      <Box miw={200} h={100}>
        <Select
          label="Payment type"
          data={paymentTypes ? paymentTypes.map((paymentType) => paymentType.name) : []}
          allowDeselect={false}
          key={form.key(`${currentItem}.payment_type`)}
          {...form.getInputProps(`${currentItem}.payment_type`)}
        />
      </Box>

      <Box miw={200} h={100}>
        <NumberInput
          readOnly
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
          readOnly
          label="VAT Excluded"
          min={0}
          prefix="₱"
          thousandSeparator=","
          decimalScale={2}
          fixedDecimalScale
          key={form.key(`${currentItem}.vat_ex`)}
          {...form.getInputProps(`${currentItem}.vat_ex`)}
        />
      </Box>

      <Box miw={200} h={100}>
        <NumberInput
          readOnly
          label="VAT Included"
          min={0}
          prefix="₱"
          thousandSeparator=","
          decimalScale={2}
          fixedDecimalScale
          key={form.key(`${currentItem}.vat_inc`)}
          {...form.getInputProps(`${currentItem}.vat_inc`)}
        />
      </Box>

      <Box miw={200} h={100}>
        <NumberInput
          disabled={durationShouldDisable}
          label="Duration (Months)"
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
          readOnly
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
