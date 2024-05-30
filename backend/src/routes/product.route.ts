import express from 'express'
import { isLoggedIn } from '../middlewares/auth.middleware'
import { isAdmin } from '../middlewares/role.middleware'

export const productRouter = express.Router()

productRouter.get('/', isLoggedIn)
productRouter.post('/', isLoggedIn, isAdmin)
productRouter.get('/:id', isLoggedIn)
productRouter.delete('/:id', isLoggedIn, isAdmin)
