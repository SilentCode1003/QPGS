import { z } from 'zod'

export const getAllCategoriesQueryDto = z.object({
  is_active: z
    .enum(['true', 'false'])
    .transform((value) => value === 'true')
    .optional(),
})
