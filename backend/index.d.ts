import type { user } from '@prisma/client'

// declare global {
//   namespace Express {
//     interface Session {
//       user?: Omit<user, 'password'>
//     }
//   }
// }

declare module 'express-session' {
  interface SessionData {
    user?: Omit<user, 'password'>
  }
}
