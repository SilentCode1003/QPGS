// Adds routes to express

import { v1Router } from '@/routes/v1.route'
import type { Express } from 'express'

export const initRoutes = (app: Express) => {
  app.use('/v1', v1Router)
  // Additional versions are added here
}
