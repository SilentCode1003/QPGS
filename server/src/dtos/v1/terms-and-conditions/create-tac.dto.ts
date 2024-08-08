import { z } from 'zod'

export const createTermsAndConditionsBodyDto = z.object({
  summary: z.string().trim().min(1),
  body: z.string().trim().min(1),
})
