import { z } from 'zod'

// Don't forget to add additional env variables
const envSchema = z.object({
  NODE_ENV: z.string(),
  API_PORT: z.coerce.number(),
  DATABASE_URL: z.string(),
})

const validatedEnv = envSchema.safeParse(process.env)

if (!validatedEnv.success) {
  throw new Error(JSON.stringify(validatedEnv.error.flatten().fieldErrors))
}

// Don't forget to add additional env variables
export const config = {
  NODE_ENV: validatedEnv.data.NODE_ENV,
  API_PORT: validatedEnv.data.API_PORT,
  DATABASE_URL: validatedEnv.data.DATABASE_URL,
}
