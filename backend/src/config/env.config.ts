import { z } from 'zod'

// Don't forget to add additional env variables
const envSchema = z.object({
  NODE_ENV: z.string(),
  API_PORT: z.coerce.number(),
  API_SESSION_SECRET: z.string(),
  FRONT_END_ORIGIN: z.string(),
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
  FRONT_END_ORIGIN: validatedEnv.data.FRONT_END_ORIGIN,
  DATABASE_URL: validatedEnv.data.DATABASE_URL,
}
