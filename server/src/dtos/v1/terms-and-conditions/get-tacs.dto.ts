import { z } from 'zod'

export const getAllTermsAndConditionsQueryDto = z.object({
  is_active: z
    .enum(['true', 'false'])
    .transform((value) => value === 'true')
    .optional(),
})
