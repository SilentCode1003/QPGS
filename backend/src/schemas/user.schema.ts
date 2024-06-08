import { z } from 'zod'

export const createUserSchema = z.object({
  first_name: z.string().trim().min(1, { message: 'First name is required' }),
  last_name: z.string().trim().min(1, { message: 'Last name is required' }).optional(),
  email: z.string().email(),
  username: z.string().trim().min(1, { message: 'Username is required' }),
  password: z.string().trim().min(1, { message: 'Password is required' }),
  role_id: z.number(),
  job_title: z.string().trim().min(1, { message: 'Job title is required' }),
})

export const updateUserSchema = z.object({
  first_name: z.string().trim().min(1, { message: 'First name is required' }).optional(),
  last_name: z.string().trim().min(1, { message: 'Last name is required' }).optional(),
  email: z.string().email().optional(),
  username: z.string().trim().min(1, { message: 'Username is required' }).optional(),
  password: z.string().trim().min(1, { message: 'Password is required' }).optional(),
  job_title: z.string().trim().min(1, { message: 'Job title is required' }).optional(),
})
