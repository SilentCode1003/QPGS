import { z } from 'zod'

export const getCategoryByIdParamDto = z.object({
  categoryId: z.coerce.number(),
})
