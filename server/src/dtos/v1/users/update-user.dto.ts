import { z } from 'zod'

export const updateUserParamDto = z.object({
  userId: z.coerce.number(),
})

export const updateUserBodyDto = z.object({
  first_name: z.string().trim().min(1).optional(),
  last_name: z.string().trim().min(1).optional(),
  email: z.string().email().optional(),
  username: z.string().trim().min(1).optional(),
  password: z.string().trim().min(1).optional(),
  role_id: z.number().optional(),
  job_title: z.string().trim().min(1).optional(),
  signature: z.string().trim().min(1).optional(),
  is_active: z.boolean().optional(),
})
