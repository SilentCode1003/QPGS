import type { Express } from 'express'
import { authRouter } from '../routes/auth.route.js'
import { userRouter } from '../routes/user.route.js'

// Init routes adds all routes to app
export const initRoutes = (app: Express) => {
  app.use('/auth', authRouter)
  app.use('/users', userRouter)
}
