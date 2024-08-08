import { z } from 'zod'

export const createProductSchema = z.object({
  name: z.string().trim().min(1, { message: 'Name is required' }),
  description: z.string().trim().min(1, { message: 'Description is required' }),
  price: z.number().gt(0, { message: 'Price must be greater than 0' }),
  category_id: z.string().min(1, { message: 'Category is required' }),
})

export type CreateProductInput = z.infer<typeof createProductSchema>
