import { z } from 'zod'

export const createRoleSchema = z.object({
  name: z.string().trim().min(1, { message: 'Name is required' }),
})

export type CreateRoleInput = z.infer<typeof createRoleSchema>
