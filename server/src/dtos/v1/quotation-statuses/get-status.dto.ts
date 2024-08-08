import { z } from 'zod'

export const getStatusByIdParamDto = z.object({
  quotationStatusId: z.coerce.number(),
})
