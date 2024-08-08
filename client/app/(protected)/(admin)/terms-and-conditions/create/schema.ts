import { z } from 'zod'

export const createTermsAndConditionsSchema = z.object({
  summary: z.string().trim().min(1, { message: 'Summary is required' }),
  body: z.string().trim().min(1, { message: 'Body is required' }),
})

export type CreateTermsAndConditionsInput = z.infer<typeof createTermsAndConditionsSchema>
