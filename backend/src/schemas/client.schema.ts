import { z } from 'zod'

export const createClientSchema = z.object({
  name: z.string().trim().min(1, { message: 'Name is required' }),
  tel_no: z.string().trim().min(1).optional(),
  contact_no: z.string().trim().min(1, { message: 'Name is required' }),
  email: z.string().email(),
  address: z.string().trim().min(1, { message: 'Address is required' }),
  created_by_id: z.number(),
})

export const updateClientSchema = z.object({
  name: z.string().trim().min(1, { message: 'Name is required' }).optional(),
  tel_no: z.string().trim().min(1).optional(),
  contact_no: z.string().trim().min(1, { message: 'Name is required' }).optional(),
  email: z.string().email().optional(),
  address: z.string().trim().min(1, { message: 'Address is required' }).optional(),
})
