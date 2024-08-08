import { z } from 'zod'

export const createClientBodyDto = z.object({
  name: z.string().trim().min(1),
  tel_no: z.string().trim().min(1).nullable(),
  contact_no: z.string().trim().min(1),
  email: z.string().email(),
  address: z.string().trim().min(1),
})
