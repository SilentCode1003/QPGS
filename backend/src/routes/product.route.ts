import express from 'express'
import { createProduct, deleteProduct, getProduct, getProducts } from '../handlers/product.handler'
import { isLoggedIn } from '../middlewares/auth.middleware'
import { isAdmin } from '../middlewares/role.middleware'

export const productRouter = express.Router()

productRouter.get('/', isLoggedIn, getProducts)
productRouter.post('/', isLoggedIn, isAdmin, createProduct)
productRouter.get('/:id', isLoggedIn, getProduct)
productRouter.delete('/:id', isLoggedIn, isAdmin, deleteProduct)
