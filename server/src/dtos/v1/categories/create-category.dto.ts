import { z } from 'zod'

export const createCategoryBodyDto = z.object({
  name: z.string().trim().min(1),
})
