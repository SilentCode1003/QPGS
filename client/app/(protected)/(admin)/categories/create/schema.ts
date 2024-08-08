import { z } from 'zod'

export const createCategorySchema = z.object({
  name: z.string().trim().min(1, { message: 'Name is required' }),
})

export type CreateCategoryInput = z.infer<typeof createCategorySchema>
