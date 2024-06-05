import type { Express } from 'express'
import { authRouter } from '../routes/auth.route.js'
import { categoryRouter } from '../routes/category.route.js'
import { clientRouter } from '../routes/client.route.js'
import { productRouter } from '../routes/product.route.js'
import { termsAndConditionsRouter } from '../routes/terms.route.js'
import { userRouter } from '../routes/user.route.js'

// Init routes adds all routes to app
export const initRoutes = (app: Express) => {
  app.use('/users', userRouter)
  app.use('/auth', authRouter)
  app.use('/terms-and-conditions', termsAndConditionsRouter)
  app.use('/clients', clientRouter)
  app.use('/categories', categoryRouter)
  app.use('/products', productRouter)
}
