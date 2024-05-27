'use client'
import ProductItem from '@/app/components/wizard/ProductItem'
import { LOCAL_STORAGE_KEY, useStepper } from '@/app/contexts/stepper'
import { Box, Button, NumberInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { randomId, readLocalStorageValue } from '@mantine/hooks'
import { useEffect } from 'react'
import { z } from 'zod'

const productSchema = z.object({
  key: z.string(),
  name: z.string().min(3),
  description: z.string().min(3),
  price: z.number().gt(0),
  payment_type: z.string().min(3),
  duration: z.number().gt(0),
  quantity: z.number().gt(0),
  markup: z.number().nonnegative(),
  vatEx: z.number(),
  vatInc: z.number(),
  vat_type: z.enum(['vatEx', 'vatInc']),
  total_amount: z.number().gt(0),
})

const step5Schema = z.object({
  products: z.array(productSchema),
  grand_total: z.number(),
})

export type Product = z.infer<typeof productSchema>
export type Step5Values = z.infer<typeof step5Schema>

export default function Step5() {
  const { updateData, incrementActive } = useStepper()

  const storageValues = readLocalStorageValue<Step5Values | undefined>({ key: LOCAL_STORAGE_KEY })

  const emptyProduct = {
    key: randomId(),
    name: '',
    description: '',
    payment_type: '',
    price: 0,
    duration: 0,
    quantity: 0,
    markup: 0,
    vatEx: 0,
    vatInc: 0,
    vat_type: 'vatEx' as const,
    total_amount: 0,
  }

  const initialProducts = storageValues?.products ? storageValues.products : [emptyProduct]

  const form = useForm<Step5Values>({
    mode: 'uncontrolled',
    initialValues: {
      products: initialProducts,
      grand_total: storageValues?.grand_total ? storageValues.grand_total : 0,
    },
    validate: zodResolver(step5Schema),
  })

  const onSubmit = (values: Step5Values) => {
    updateData(values)
    incrementActive()
  }

  const fields = form
    .getValues()
    .products.map((item, index) => (
      <ProductItem key={item.key} form={form} item={item} index={index} />
    ))

  useEffect(() => {
    const grandTotal = form
      .getValues()
      .products.map((product) => product.total_amount)
      .reduce((prev, current) => prev + current, 0)

    form.setFieldValue('grand_total', grandTotal)
  }, [form])

  return (
    <Box>
      <form onSubmit={form.onSubmit(onSubmit)}>
        {fields}

        <Button onClick={() => form.insertListItem('products', emptyProduct)}>Add product</Button>

        <NumberInput
          disabled
          prefix="₱"
          thousandSeparator=","
          label="Grand total"
          decimalScale={2}
          fixedDecimalScale
          key={form.key('grand_total')}
          {...form.getInputProps('grand_total')}
        />

        <Button type="submit">Next</Button>
      </form>
    </Box>
  )
}
