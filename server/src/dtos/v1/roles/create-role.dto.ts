import { z } from 'zod'

export const createRoleBodyDto = z.object({
  name: z.string().trim().min(1),
})
