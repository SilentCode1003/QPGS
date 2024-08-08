import { z } from 'zod'

export const loginSchema = z.object({
  username: z.string().trim().min(1, { message: 'Username is required' }),
  password: z.string().trim().min(1, { message: 'Password is required' }),
})

export type LoginInput = z.infer<typeof loginSchema>
