import { z } from 'zod'

export const updateCategoryBodyDto = z.object({
  name: z.string().trim().min(1).optional(),
  is_active: z.boolean().optional(),
})
