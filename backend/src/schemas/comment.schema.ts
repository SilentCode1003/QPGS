import { z } from 'zod'

export const createCommentSchema = z.object({
  quotation_id: z.string().trim().min(1, { message: 'Quotation id is required' }),
  body: z.string().trim().min(1, { message: 'Body is required' }),
})

export const updateCommentSchema = z.object({
  body: z.string().trim().min(1, { message: 'Body is required' }),
})
