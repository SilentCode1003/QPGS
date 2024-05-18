import type { Express } from 'express'
import { userRouter } from '../routes/user.route.js'

// Init routes adds all routes to app
export const initRoutes = (app: Express) => {
  app.use('/users', userRouter)
}
