import { useGetAllProducts } from '@/api/products/all'
import { Button, Container, Group, NumberInput, Paper, ScrollArea, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import { randomId } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { zodResolver } from 'mantine-form-zod-resolver'
import { useEffect } from 'react'
import { z } from 'zod'
import ProductField from './ProductFIeld'
import { STEP1_LOCAL_STORAGE_KEY } from './Step1'
import { useGetCategoryById } from '@/api/categories/get-by-id'

const step4Schema = z.object({
  grand_total: z.number().gt(0, { message: 'Grand Total is required' }),
  products: z
    .array(
      z.object({
        key: z.string(),
        product_id: z.string().trim().min(1),
        entry_name: z.string().trim().min(1),
        entry_description: z.string().trim().min(1),
        entry_price: z.number(),
        markup: z.number(),
        vat_ex: z.number(),
        vat_inc: z.number(),
        vat_type: z.enum(['vat_ex', 'vat_inc']),
        duration: z.number().gt(0, { message: 'Duration is required' }),
        quantity: z.number().gt(0, { message: 'Quantity is required' }),
        total_amount: z.number(),
      })
    )
    .nonempty(),
})

export type Step4Input = z.infer<typeof step4Schema>

export const STEP4_LOCAL_STORAGE_KEY = 'qs-step-4' as const

export default function Step4({
  nextStep,
  prevStep,
}: {
  nextStep: () => void
  prevStep: () => void
}) {
  const categoryId =
    JSON.parse(window.localStorage.getItem(STEP1_LOCAL_STORAGE_KEY)!)?.category_id || '1'

  const { data: category, isLoading: categoryIsLoading } = useGetCategoryById(Number(categoryId))

  const { data: products, isLoading: productsIsLoading } = useGetAllProducts({
    is_active: 'true',
    category_id: categoryId,
  })

  const defaultProduct = {
    key: randomId(),
    product_id: '',
    entry_name: '',
    entry_description: '',
    entry_price: 0,
    markup: 0,
    vat_ex: 0,
    vat_inc: 0,
    vat_type: 'vat_ex' as const,
    duration: 1,
    quantity: 0,
    total_amount: 0,
  }

  const form = useForm<Step4Input>({
    mode: 'uncontrolled',
    initialValues: {
      grand_total: 0,
      products: [defaultProduct],
    },
    onValuesChange: (values) => {
      window.localStorage.setItem(STEP4_LOCAL_STORAGE_KEY, JSON.stringify(values))
    },
    validate: zodResolver(step4Schema),
  })

  const computedGrandTotal = form
    .getValues()
    .products.map((product) => product.total_amount)
    .reduce((a, b) => a + b, 0)

  const handleSubmit = (values: typeof form.values) => {
    nextStep()
  }

  const handleAddProduct = () => {
    form.insertListItem('products', defaultProduct)
  }

  useEffect(() => {
    const storedValue = window.localStorage.getItem(STEP4_LOCAL_STORAGE_KEY)

    if (storedValue) {
      try {
        form.setValues(JSON.parse(window.localStorage.getItem(STEP4_LOCAL_STORAGE_KEY)!))
      } catch (error) {
        notifications.show({
          title: 'Error',
          message: 'Failed to parse stored value',
          color: 'red',
        })
      }
    }
  }, [])

  useEffect(() => {
    form.setFieldValue('grand_total', computedGrandTotal)
  }, [computedGrandTotal, form])

  const fields = form
    .getValues()
    .products.map((item, index) => (
      <ProductField
        key={item.key}
        item={item}
        index={index}
        form={form}
        products={products}
        productsIsLoading={productsIsLoading}
        category={category?.data}
      />
    ))

  return (
    <div>
      <Container size="lg">
        <Paper withBorder p={30} mt={30} radius="md">
          <Title mb={36}>Quotation Products</Title>

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Button onClick={handleAddProduct}>Add product</Button>

            <ScrollArea py="lg" scrollbars="x">
              {fields}
            </ScrollArea>

            <NumberInput
              className="font-bold"
              label="Grand Total"
              prefix="₱"
              readOnly
              allowNegative={false}
              decimalScale={2}
              fixedDecimalScale={true}
              decimalSeparator="."
              thousandSeparator=","
              key={form.key('grand_total')}
              {...form.getInputProps('grand_total')}
            />

            <Group mt={48} justify="end">
              <Button type="button" onClick={prevStep} variant="default">
                Back
              </Button>
              <Button type="submit">Next</Button>
            </Group>
          </form>
        </Paper>
      </Container>
    </div>
  )
}
