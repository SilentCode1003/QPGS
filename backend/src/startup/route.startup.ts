import type { Express } from 'express'
import { ensureLogin } from '../middlewares/auth.middleware.js'
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
  app.use('/auth', authRouter)
  app.use('/users', ensureLogin, userRouter)
  app.use('/roles', ensureLogin, roleRouter)
  app.use('/terms-and-conditions', ensureLogin, termsAndConditionsRouter)
  app.use('/clients', ensureLogin, clientRouter)
  app.use('/categories', ensureLogin, categoryRouter)
  app.use('/products', ensureLogin, productRouter)
  app.use('/statuses', ensureLogin, statusRouter)
  app.use('/quotations', ensureLogin, quotationRouter)
  app.use('/comments', ensureLogin, commentRouter)
}
