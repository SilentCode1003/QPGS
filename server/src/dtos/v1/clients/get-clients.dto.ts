import { z } from 'zod'

export const getAllClientsQueryDto = z.object({
  is_active: z
    .enum(['true', 'false'])
    .transform((value) => value === 'true')
    .optional(),
})
