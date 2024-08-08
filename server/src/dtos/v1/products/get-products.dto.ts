import { z } from 'zod'

export const getAllProductsQueryDto = z.object({
  is_active: z
    .enum(['true', 'false'])
    .transform((value) => value === 'true')
    .optional(),
  category_id: z.coerce.number().optional(),
})
