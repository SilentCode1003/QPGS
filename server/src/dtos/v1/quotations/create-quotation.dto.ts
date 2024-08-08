import { z } from 'zod'

export const createQuotationBodyDto = z.object({
  category_id: z.number(),
  subject: z.string().trim().min(1),
  date: z.string().datetime(),
  expiry_date: z.string().datetime(),
  note: z.string().trim().min(1).nullable().optional(),
  terms_and_conditions: z.string().trim().min(1),
  client_id: z.number(),
  grand_total: z.string().trim().min(1),

  quotation_products: z
    .array(
      z.object({
        product_id: z.number(),
        entry_name: z.string().trim().min(1),
        entry_description: z.string().trim().min(1),
        entry_price: z.string().trim().min(1),
        markup: z.number(),
        vat_ex: z.string().trim().min(1),
        vat_inc: z.string().trim().min(1),
        vat_type: z.enum(['vat_ex', 'vat_inc']),
        duration: z.number(),
        quantity: z.number(),
        total_amount: z.string().trim().min(1),
      }),
    )
    .nonempty(),
})
