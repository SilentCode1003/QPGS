import type { user } from '@prisma/client'

declare module 'express-session' {
  interface SessionData {
    user?: Omit<user, 'password'>
  }
}
