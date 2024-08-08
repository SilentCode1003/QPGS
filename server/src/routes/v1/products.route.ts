import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from '@/handlers/v1/products.handler'
import { ensureAdmin, ensureLogin } from '@/middlewares/auth.middleware'
import express from 'express'

export const productsRouter = express.Router()

// Admin and user
productsRouter.get('/', ensureLogin, getAllProducts)

// Admin only
productsRouter.post('/', ensureLogin, ensureAdmin, createProduct)

// Admin and user
productsRouter.get('/:productId', ensureLogin, getProductById)

// Admin only
productsRouter.patch('/:productId', ensureLogin, ensureAdmin, updateProduct)

// Admin only
productsRouter.delete('/:productId', ensureLogin, ensureAdmin, deleteProduct)
