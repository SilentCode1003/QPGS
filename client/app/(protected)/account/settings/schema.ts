import { z } from 'zod'

export const changePasswordSchema = z.object({
  password: z.string().trim().min(1, { message: 'Password is required' }),
})

export type UpdateUserInput = z.infer<typeof changePasswordSchema>
