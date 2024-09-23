import {
  CreateQuotationPayload,
  QuotationProducts,
  useCreateQuotation,
} from '@/api/quotations/create'
import { Button, Container, Group, NumberFormatter, Paper, Text, Title } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useRouter } from 'next/navigation'
import ReviewCategory from './ReviewCategory'
import ReviewClient from './ReviewClient'
import ReviewInformation from './ReviewInformation'
import ReviewProducts from './ReviewProducts'
import { QS_STEP_NUMBER_LOCAL_STORAGE_KEY, STEP1_LOCAL_STORAGE_KEY } from './Step1'
import { STEP2_LOCAL_STORAGE_KEY } from './Step2'
import { STEP3_LOCAL_STORAGE_KEY } from './Step3'
import { STEP4_LOCAL_STORAGE_KEY } from './Step4'
import { useState } from 'react'

export type QpProduct = {
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

export type Payload = {
  category_id: string
  subject: string
  date: string
  expiry_date: string
  note: string | null
  terms_and_conditions: string
  client_id: string
  grand_total: number
  products: QpProduct[]
}

type CompleteProps = {
  prevStep: () => void
  payload: Payload
}

export default function Review({ prevStep, payload }: CompleteProps) {
  const router = useRouter()

  const { mutateAsync: createQuotation, isPending } = useCreateQuotation()

  const [shouldDisable, setShouldDisable] = useState(false)

  const handleCreate = async () => {
    const transformedProducts: QuotationProducts[] = payload.products.map((qp) => ({
      ...qp,
      product_id: Number(qp.product_id),
      entry_price: qp.entry_price.toString(),
      vat_ex: qp.vat_ex.toString(),
      vat_inc: qp.vat_inc.toString(),
      total_amount: qp.total_amount.toString(),
    }))

    const transformedPayload: CreateQuotationPayload = {
      category_id: Number(payload.category_id),
      subject: payload.subject,
      date: payload.date,
      expiry_date: payload.expiry_date,
      note: payload.note === '' ? null : payload.note,
      terms_and_conditions: payload.terms_and_conditions,
      client_id: Number(payload.client_id),
      quotation_products: transformedProducts,
      grand_total: payload.grand_total.toString(),
    }

    try {
      await createQuotation(transformedPayload)
      notifications.show({
        title: 'Success',
        message: 'Quotation successfully created',
        color: 'green',
      })
      setShouldDisable(true)
      window.localStorage.removeItem(QS_STEP_NUMBER_LOCAL_STORAGE_KEY)
      window.localStorage.removeItem(STEP1_LOCAL_STORAGE_KEY)
      window.localStorage.removeItem(STEP2_LOCAL_STORAGE_KEY)
      window.localStorage.removeItem(STEP3_LOCAL_STORAGE_KEY)
      window.localStorage.removeItem(STEP4_LOCAL_STORAGE_KEY)
      router.push('/dashboard')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <Paper withBorder p={30} mt={30} radius="md">
        <Title>Review your quotation</Title>

        <ReviewCategory payload={payload} />

        <ReviewInformation payload={payload} />

        <ReviewClient payload={payload} />

        <ReviewProducts payload={payload} />

        <Group justify="center">
          <Text size="lg" fw={700}>
            Grand Total:{' '}
          </Text>
          <Text size="lg" fw={700} c="green">
            <NumberFormatter
              prefix="₱"
              value={payload.grand_total}
              thousandSeparator=","
              decimalSeparator="."
              decimalScale={2}
            />
          </Text>
        </Group>

        <Group mt={48} justify="end">
          <Button type="button" onClick={prevStep} variant="default">
            Back
          </Button>
          <Button onClick={handleCreate} disabled={shouldDisable || isPending}>
            Create
          </Button>
        </Group>
      </Paper>
    </div>
  )
}
