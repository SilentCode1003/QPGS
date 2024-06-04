import { z } from 'zod'

export const createRoleSchema = z.object({
  name: z.string().trim().min(1, { message: 'Name is required' }),
})
