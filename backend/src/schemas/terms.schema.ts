import { z } from 'zod'

export const createPresetSchema = z.object({
  summary: z.string().trim().min(1, { message: 'Summary is required' }),
  body: z.string().trim().min(1, { message: 'Body is required' }),
})
