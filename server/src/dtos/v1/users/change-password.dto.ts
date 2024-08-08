import { z } from 'zod'

export const changePasswordBodyDto = z.object({
  password: z.string().trim().min(1),
})
