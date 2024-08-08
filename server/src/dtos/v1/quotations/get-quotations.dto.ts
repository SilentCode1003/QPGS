import { z } from 'zod'

export const getAllQuotationsQueryDto = z.object({
  category_id: z.coerce.number().optional(),
  client_id: z.coerce.number().optional(),
  quotation_status: z.enum(['pending', 'approved']).optional(),
  created_by_id: z.coerce.number().optional(),
  approved_by_id: z.coerce.number().optional(),
})
