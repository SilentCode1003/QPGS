import { z } from 'zod'

export const createCommentSchema = z.object({
  body: z.string().trim().min(1, { message: 'Body is required' }),
})

export const updateCommentSchema = z.object({
  body: z.string().trim().min(1, { message: 'Body is required' }),
})
