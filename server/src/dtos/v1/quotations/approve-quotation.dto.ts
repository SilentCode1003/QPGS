import { z } from 'zod'

export const approveQuotationParamDto = z.object({
  quotationId: z.coerce.number(),
})
