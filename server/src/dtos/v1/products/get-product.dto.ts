import { z } from 'zod'

export const getProductByIdParamDto = z.object({
  productId: z.coerce.number(),
})
