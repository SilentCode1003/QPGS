import { z } from 'zod'

export const updateQuotationCommentParamDto = z.object({
  commentId: z.coerce.number(),
})

export const updateQuotationCommentBodyDto = z.object({
  body: z.string().trim().min(1).optional(),
  is_active: z.boolean().optional(),
})
