import { z } from 'zod'

export const createQuotationCommentBodyDto = z.object({
  body: z.string().trim().min(1),
})
