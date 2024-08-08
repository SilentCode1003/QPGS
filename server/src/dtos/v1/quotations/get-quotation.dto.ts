import { z } from 'zod'

export const getQuotationByIdParamDto = z.object({
  quotationId: z.coerce.number(),
})
