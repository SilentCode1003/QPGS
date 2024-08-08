import { z } from 'zod'

export const getQuotationCommentsParamDto = z.object({
  quotationId: z.coerce.number(),
})

export const getQuotationCommentsQueryDto = z.object({
  is_active: z
    .enum(['true', 'false'])
    .transform((value) => value === 'true')
    .optional(),
})
