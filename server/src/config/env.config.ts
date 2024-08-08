import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['production', 'development']),

  DATABASE_URL: z.string().trim().min(1),

  MONGODB_URL: z.string().trim().min(1),

  SERVER_PORT: z.string().trim().min(1),
  SERVER_LOGGING_LEVEL: z.enum(['fatal', 'error', 'warn', 'http', 'info', 'debug', 'trace']), // See src/utils/logger.util.ts
  SERVER_SESSION_SECRET: z.string().trim().min(1),
  SERVER_IS_HTTPS: z.enum(['true', 'false']).transform((value) => value === 'true'),

  CLIENT_ORIGIN: z.string().trim().min(1),
})

const validatedEnv = envSchema.safeParse(process.env)

if (!validatedEnv.success) {
  throw new Error('Invalid .env: ' + JSON.stringify(validatedEnv.error.flatten().fieldErrors))
}

export const CONFIG_ENV = {
  NODE_ENV: validatedEnv.data.NODE_ENV,

  DATABASE_URL: validatedEnv.data.DATABASE_URL,

  MONGODB_URL: validatedEnv.data.MONGODB_URL,

  SERVER_PORT: validatedEnv.data.SERVER_PORT,
  SERVER_LOGGING_LEVEL: validatedEnv.data.SERVER_LOGGING_LEVEL,
  SERVER_SESSION_SECRET: validatedEnv.data.SERVER_SESSION_SECRET,
  SERVER_IS_HTTPS: validatedEnv.data.SERVER_IS_HTTPS,

  CLIENT_ORIGIN: validatedEnv.data.CLIENT_ORIGIN,
} as const
