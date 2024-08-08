import { z } from 'zod'

export const updateTermsAndConditionsBodyDto = z.object({
  summary: z.string().trim().min(1).optional(),
  body: z.string().trim().min(1).optional(),
  is_active: z.boolean().optional(),
})
