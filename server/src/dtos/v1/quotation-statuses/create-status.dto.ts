import { z } from 'zod'

export const createStatusBodyDto = z.object({
  name: z.string().trim().min(1),
})
