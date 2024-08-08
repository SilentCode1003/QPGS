import { z } from 'zod'

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

function isValidDataUri(str: string) {
  // Regular expression for Data URI format
  const dataUriPattern = /^data:([a-z]+\/[a-z0-9-+.]+);base64,([a-zA-Z0-9+/=]+)$/

  // Test if the string matches the Data URI pattern
  const matches = str.match(dataUriPattern)

  if (!matches) {
    return false
  }

  // Extract the Base64 part
  const mimeType = matches[1]
  const base64Data = matches[2]

  if (!ACCEPTED_IMAGE_TYPES.includes(mimeType || '')) {
    return false
  }

  // Check if the Base64 part is valid
  try {
    atob(base64Data || '')
    return true
  } catch (error) {
    return false
  }
}

export const createUserBodyDto = z.object({
  first_name: z.string().trim().min(1),
  last_name: z.string().trim().min(1),
  email: z.string().email(),
  username: z.string().trim().min(1),
  password: z.string().trim().min(1),
  role_id: z.number(),
  job_title: z.string().trim().min(1),
  signature: z
    .string()
    .refine((string) => isValidDataUri(string))
    .nullable(),
})
