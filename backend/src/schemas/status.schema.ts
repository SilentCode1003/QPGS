import { z } from 'zod'

export const createStatusSchema = z.object({
  name: z.string().trim().min(1, { message: 'Name is required' }),
})
