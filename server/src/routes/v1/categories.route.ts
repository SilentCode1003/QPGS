import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
} from '@/handlers/v1/categories.handler'
import { ensureAdmin, ensureLogin } from '@/middlewares/auth.middleware'
import express from 'express'

export const categoriesRouter = express.Router()

// Admin and user
categoriesRouter.get('/', ensureLogin, getAllCategories)

// Admin only
categoriesRouter.post('/', ensureLogin, ensureAdmin, createCategory)

// Admin and users
categoriesRouter.get('/:categoryId', ensureLogin, getCategoryById)

// Admin only
categoriesRouter.patch('/:categoryId', ensureLogin, ensureAdmin, updateCategory)

// Admin only
categoriesRouter.delete('/:categoryId', ensureLogin, ensureAdmin, deleteCategory)
