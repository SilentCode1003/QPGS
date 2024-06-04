import { z } from 'zod'

export const numberIdParamSchema = z.object({
  id: z.coerce.number(),
})
