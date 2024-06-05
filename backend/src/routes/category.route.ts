import express from 'express'
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
} from '../handlers/category.handler'

export const categoryRouter = express.Router()

// Anyone can get all the categories
categoryRouter.get('/', getCategories)

// Only admin can add a category
categoryRouter.post('/', createCategory)

// Anyone can access category info
categoryRouter.get('/:id', getCategory)

// Only admin can edit a category
categoryRouter.put('/:id', updateCategory)

// Only admin can delete a category
categoryRouter.delete('/:id', deleteCategory)
