import { z } from 'zod'

export const getClientByIdParamDto = z.object({
  clientId: z.coerce.number(),
})
