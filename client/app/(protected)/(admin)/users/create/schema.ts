import { z } from 'zod'

const MAX_FILE_SIZE = 5_000_000 // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

export const createUserSchema = z.object({
  first_name: z.string().trim().min(1, { message: 'First name is required' }),
  last_name: z.string().trim().min(1, { message: 'Last name is required' }),
  email: z.string().email(),
  username: z.string().trim().min(1, { message: 'Username is required' }),
  password: z.string().trim().min(1, { message: 'Password is required' }),
  role_id: z.string().trim().min(1, { message: 'Role is required' }),
  job_title: z.string().trim().min(1, { message: 'Job title is required' }),
  signature: z
    .any()
    .refine((file) => file?.size <= MAX_FILE_SIZE, 'Max image size is 5MB.')
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      'Only .jpg, .jpeg, .png, and .webp formated are supported'
    )
    .nullable(),
})

export type CreateUserInput = z.infer<typeof createUserSchema>
