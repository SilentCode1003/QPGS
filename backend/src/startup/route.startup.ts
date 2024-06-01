import type { Express } from 'express'
import { authRouter } from '../routes/auth.route.js'
import { clientRouter } from '../routes/client.route.js'
import { commentRouter } from '../routes/comment.route.js'
import { paymentTypeRouter } from '../routes/payment-type.route.js'
import { productRouter } from '../routes/product.route.js'
import { quotationRouter } from '../routes/quotation.route.js'
import { termsAndConditionRouter } from '../routes/terms.route.js'
import { userRouter } from '../routes/user.route.js'

// Init routes adds all routes to app
export const initRoutes = (app: Express) => {
  app.use('/auth', authRouter)
  app.use('/users', userRouter)
  app.use('/payment-types', paymentTypeRouter)
  app.use('/clients', clientRouter)
  app.use('/terms-and-conditions', termsAndConditionRouter)
  app.use('/products', productRouter)
  app.use('/quotations', quotationRouter)
  app.use('/comments', commentRouter)
}
