import { z } from 'zod'

export const createProductBodyDto = z.object({
  name: z.string().trim().min(1),
  description: z.string().trim().min(1),
  price: z.number(),
  category_id: z.number(),
})
