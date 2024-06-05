import express from 'express'
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from '../handlers/product.handler'

export const productRouter = express.Router()

// Anyone can get products info
productRouter.get('/', getProducts)

// Only admin can create a product
productRouter.post('/', createProduct)

// Anyone can get product info
productRouter.get('/:id', getProduct)

// Only admin can update a product
productRouter.put('/:id', updateProduct)

// Only admin can delete a product
productRouter.delete('/:id', deleteProduct)
