import { z } from 'zod'

// Don't forget to add additional env variables
const envSchema = z.object({
  NODE_ENV: z.string(),
  API_PORT: z.coerce.number(),
  API_SESSION_SECRET: z.string(),
  FRONTEND_HOST: z.string(),
  FRONTEND_PORT: z.coerce.number(),
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
  API_SESSION_SECRET: validatedEnv.data.API_SESSION_SECRET,
  FRONTEND_HOST: validatedEnv.data.FRONTEND_HOST,
  FRONTEND_PORT: validatedEnv.data.FRONTEND_PORT,
  DATABASE_URL: validatedEnv.data.DATABASE_URL,
}
