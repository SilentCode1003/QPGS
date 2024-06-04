import type { Express } from 'express'
import { authRouter } from '../routes/auth.route.js'
import { roleRouter } from '../routes/role.route.js'
import { userRouter } from '../routes/user.route.js'

// Init routes adds all routes to app
export const initRoutes = (app: Express) => {
  app.use('/users', userRouter)
  app.use('/auth', authRouter)
  app.use('/roles', roleRouter)
}
