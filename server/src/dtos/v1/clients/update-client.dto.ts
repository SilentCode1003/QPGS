import { z } from 'zod'

export const updateClientBodyDto = z.object({
  name: z.string().trim().min(1).optional(),
  tel_no: z.string().trim().min(1).nullable().optional(),
  contact_no: z.string().trim().min(1).optional(),
  email: z.string().email().optional(),
  address: z.string().trim().min(1).optional(),
  created_by_id: z.number().optional(),
  is_active: z.boolean().optional(),
})
