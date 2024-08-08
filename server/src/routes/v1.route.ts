import { authRouter } from '@/routes/v1/auth.route'
import { categoriesRouter } from '@/routes/v1/categories.route'
import { clientsRouter } from '@/routes/v1/clients.route'
import { quotationCommentsRouter } from '@/routes/v1/comments.route'
import { dashboardRouter } from '@/routes/v1/dashboard.route'
import { productsRouter } from '@/routes/v1/products.route'
import { quotationsRouter } from '@/routes/v1/quotations.route'
import { rolesRouter } from '@/routes/v1/roles.routes'
import { termsAndConditionsRouter } from '@/routes/v1/terms-and-conditions.route'
import { usersRouter } from '@/routes/v1/users.route'
import express from 'express'

export const v1Router = express.Router()

v1Router.use('/users', usersRouter)
v1Router.use('/auth', authRouter)
v1Router.use('/roles', rolesRouter)
v1Router.use('/terms-and-conditions', termsAndConditionsRouter)
v1Router.use('/clients', clientsRouter)
v1Router.use('/categories', categoriesRouter)
v1Router.use('/products', productsRouter)
v1Router.use('/quotations', quotationsRouter)
v1Router.use('/comments', quotationCommentsRouter)
v1Router.use('/dashboard', dashboardRouter)
