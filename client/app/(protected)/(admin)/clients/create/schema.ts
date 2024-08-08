import { z } from 'zod'

export const createClientSchema = z.object({
  name: z.string().trim().min(1, { message: 'Name is required' }),
  tel_no: z.string().trim().nullable(),
  contact_no: z.string().trim().min(1, { message: 'Conatact No. is required' }),
  email: z.string().email(),
  address: z.string().trim().min(1, { message: 'Address is required' }),
})

export type CreateClientInput = z.infer<typeof createClientSchema>
