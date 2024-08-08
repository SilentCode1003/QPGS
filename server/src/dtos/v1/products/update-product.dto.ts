import { z } from 'zod'

export const updateProductBodyDto = z.object({
  name: z.string().trim().min(1).optional(),
  description: z.string().trim().min(1).optional(),
  price: z.number().optional(),
  category_id: z.number().optional(),
  is_active: z.boolean().optional(),
})
