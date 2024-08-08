import type { role, user } from '@prisma/client'

declare module 'express-session' {
  interface SessionData {
    // user with role included in relation
    user: (Omit<user, 'password' | 'signature'> & { role: role }) | null
  }
}
