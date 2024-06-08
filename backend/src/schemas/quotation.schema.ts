import { z } from 'zod'
import { VatType } from './vat.enum'

const quotationProductSchema = z.object({
  id: z.number(),
  markup: z.number().nonnegative(),
  vat_ex: z.number().gt(0),
  vat_inc: z.number().gt(0),
  vat_type: z.nativeEnum(VatType),
  duration: z.number().min(1),
  quantity: z.number().min(1),
  total_amount: z.number().gt(0),
})

export const createQuotationSchema = z.object({
  type: z.string().trim().min(1, { message: 'Type is required' }),
  subject: z.string().trim().min(1, { message: 'Subject is required' }),
  date: z.string().datetime(),
  expiry_date: z.string().datetime(),
  note: z.string().trim().min(1, { message: 'Note is required' }),
  terms_and_conditions: z.string().trim().min(1, { message: 'Terms and conditions is required' }),
  client_id: z.number(),
  products: z.array(quotationProductSchema).nonempty(),
  grand_total: z.number().gt(0),
})

export const updateQuotationSchema = z.object({
  type: z.string().trim().min(1, { message: 'Type is required' }),
  subject: z.string().trim().min(1, { message: 'Subject is required' }),
  date: z.string().datetime(),
  expiry_date: z.string().datetime(),
  note: z.string().trim().min(1, { message: 'Note is required' }),
  terms_and_conditions: z.string().trim().min(1, { message: 'Terms and conditions is required' }),
  client_id: z.number(),
  grand_total: z.number().gt(0),
})
