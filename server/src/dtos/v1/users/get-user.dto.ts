import { z } from 'zod'

export const getUserParamDto = z.object({
  userId: z.coerce.number(),
})
