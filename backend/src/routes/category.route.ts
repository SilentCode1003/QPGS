import express from 'express'
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
} from '../handlers/category.handler'
import { isAdmin } from '../middlewares/auth.middleware'

export const categoryRouter = express.Router()

// Anyone can get all the categories
categoryRouter.get('/', getCategories)

// Only admin can add a category
categoryRouter.post('/', isAdmin, createCategory)

// Anyone can access category info
categoryRouter.get('/:id', getCategory)

// Only admin can edit a category
categoryRouter.put('/:id', isAdmin, updateCategory)

// Only admin can delete a category
categoryRouter.delete('/:id', isAdmin, deleteCategory)
