import { GetAllProductsResponse } from '@/api/products/all'
import { CONFIG_CONSTANT } from '@/config/constant'
import { ActionIcon, Flex, Input, NumberInput, Paper, Radio, Select, Skeleton } from '@mantine/core'
import { UseFormReturnType } from '@mantine/form'
import { IconTrash } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import Description from './Description'
import { Step4Input } from './Step4'
import { Category } from '@/api/categories/all'

type ProductFieldProps = {
  item: {
    key: string
    product_id: string
    entry_name: string
    entry_description: string
    entry_price: number
    markup: number
    vat_ex: number
    vat_inc: number
    vat_type: 'vat_ex' | 'vat_inc'
    duration: number
    quantity: number
    total_amount: number
  }
  index: number
  form: UseFormReturnType<Step4Input>
  products: GetAllProductsResponse | undefined
  productsIsLoading: boolean
  category: Category | undefined
}

export default function ProductField({
  item,
  index,
  form,
  products,
  productsIsLoading,
  category,
}: ProductFieldProps) {
  const currentProduct = form.getValues().products[index]

  const [markup, setMarkup] = useState(currentProduct.markup)
  const [vatType, setVatType] = useState(currentProduct.vat_type)
  const [duration, setDuration] = useState(currentProduct.duration)
  const [quantity, setQuantity] = useState(currentProduct.quantity)

  const computedVatEx = currentProduct.entry_price * (1 + markup / 100)
  const computedVatInc = computedVatEx * CONFIG_CONSTANT.VAT_INC_RATE
  const computedTotalAmount =
    (vatType === 'vat_ex' ? currentProduct.vat_ex : currentProduct.vat_inc) * quantity * duration

  form.watch(`products.${index}.markup`, ({ value }) => {
    setMarkup(value as number)
  })
  form.watch(`products.${index}.vat_type`, ({ value }) => {
    setVatType(value as 'vat_ex' | 'vat_inc')
  })
  form.watch(`products.${index}.duration`, ({ value }) => {
    setDuration(value as number)
  })
  form.watch(`products.${index}.quantity`, ({ value }) => {
    setQuantity(value as number)
  })

  form.watch(`products.${index}.entry_name`, ({ previousValue, value }) => {
    if (!value) return

    const foundProduct = products?.data.find((product) => product.name === value)

    if (!foundProduct) {
      return
    }

    form.setFieldValue(`products.${index}.product_id`, foundProduct.id.toString())
    form.setFieldValue(`products.${index}.entry_description`, foundProduct.description)
    form.setFieldValue(`products.${index}.entry_price`, Number(foundProduct.price))
  })

  useEffect(() => {
    form.setFieldValue(`products.${index}.vat_ex`, computedVatEx)
    form.setFieldValue(`products.${index}.vat_inc`, computedVatInc)
    form.setFieldValue(`products.${index}.total_amount`, computedTotalAmount)
  }, [markup, duration, quantity, form, computedVatEx, index, computedVatInc, computedTotalAmount])

  return (
    <Paper withBorder p={24} mb={12}>
      <Flex gap="sm">
        {productsIsLoading ? (
          <Skeleton h={28} w={250} />
        ) : (
          <Select
            miw={250}
            label="Name"
            data={products?.data.map((product) => product.name)}
            searchable={true}
            nothingFoundMessage="Nothing found..."
            maxDropdownHeight={250}
            allowDeselect={false}
            key={form.key(`products.${index}.entry_name`)}
            {...form.getInputProps(`products.${index}.entry_name`)}
          />
        )}

        <Input.Wrapper w={300} className="text-sm" label="Description">
          <Description content={form.getValues().products[index].entry_description} />
        </Input.Wrapper>

        <NumberInput
          w={200}
          label="Price"
          prefix="₱"
          readOnly
          allowNegative={false}
          decimalScale={2}
          fixedDecimalScale={true}
          decimalSeparator="."
          thousandSeparator=","
          key={form.key(`products.${index}.entry_price`)}
          {...form.getInputProps(`products.${index}.entry_price`)}
        />

        <NumberInput
          w={200}
          label="Markup"
          suffix="%"
          allowNegative={false}
          decimalScale={2}
          decimalSeparator="."
          thousandSeparator=","
          key={form.key(`products.${index}.markup`)}
          {...form.getInputProps(`products.${index}.markup`)}
        />

        <NumberInput
          w={200}
          label="VAT Excluded Price"
          prefix="₱"
          readOnly
          allowNegative={false}
          decimalScale={2}
          fixedDecimalScale={true}
          decimalSeparator="."
          thousandSeparator=","
          key={form.key(`products.${index}.vat_ex`)}
          {...form.getInputProps(`products.${index}.vat_ex`)}
        />

        <NumberInput
          w={200}
          label="VAT Included Price"
          prefix="₱"
          readOnly
          allowNegative={false}
          decimalScale={2}
          fixedDecimalScale={true}
          decimalSeparator="."
          thousandSeparator=","
          key={form.key(`products.${index}.vat_inc`)}
          {...form.getInputProps(`products.${index}.vat_inc`)}
        />

        <Radio.Group
          label="VAT Type"
          key={form.key(`products.${index}.vat_type`)}
          {...form.getInputProps(`products.${index}.vat_type`)}
        >
          <Radio value="vat_ex" label="Excluded" />
          <Radio value="vat_inc" label="Included" />
        </Radio.Group>

        {/* Only show when category is not hardware */}
        {!category ? (
          <Skeleton h={28} w={250} />
        ) : (
          category.name !== CONFIG_CONSTANT.DB_CATEGORY_HARDWARE_NAME && (
            <NumberInput
              label="Duration (Months)"
              allowNegative={false}
              allowDecimal={false}
              key={form.key(`products.${index}.duration`)}
              {...form.getInputProps(`products.${index}.duration`)}
            />
          )
        )}

        <NumberInput
          label="Quantity"
          allowNegative={false}
          allowDecimal={false}
          key={form.key(`products.${index}.quantity`)}
          {...form.getInputProps(`products.${index}.quantity`)}
        />

        <NumberInput
          w={200}
          label="Total Amount"
          prefix="₱"
          readOnly
          allowNegative={false}
          decimalScale={2}
          fixedDecimalScale={true}
          decimalSeparator="."
          thousandSeparator=","
          key={form.key(`products.${index}.total_amount`)}
          {...form.getInputProps(`products.${index}.total_amount`)}
        />
        <ActionIcon
          disabled={form.getValues().products.length === 1}
          color="red"
          onClick={() => form.removeListItem('products', index)}
        >
          <IconTrash size="1rem" />
        </ActionIcon>
      </Flex>
    </Paper>
  )
}
