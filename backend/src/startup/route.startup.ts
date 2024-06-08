import type { Express } from 'express'
import { authRouter } from '../routes/auth.route.js'
import { categoryRouter } from '../routes/category.route.js'
import { clientRouter } from '../routes/client.route.js'
import { commentRouter } from '../routes/comment.route.js'
import { productRouter } from '../routes/product.route.js'
import { quotationRouter } from '../routes/quotation.route.js'
import { roleRouter } from '../routes/role.route.js'
import { statusRouter } from '../routes/status.route.js'
import { termsAndConditionsRouter } from '../routes/terms.route.js'
import { userRouter } from '../routes/user.route.js'

// Init routes adds all routes to app
export const initRoutes = (app: Express) => {
  app.use('/users', userRouter)
  app.use('/auth', authRouter)
  app.use('/roles', roleRouter)
  app.use('/terms-and-conditions', termsAndConditionsRouter)
  app.use('/clients', clientRouter)
  app.use('/categories', categoryRouter)
  app.use('/products', productRouter)
  app.use('/statuses', statusRouter)
  app.use('/quotations', quotationRouter)
  app.use('/comments', commentRouter)
}
