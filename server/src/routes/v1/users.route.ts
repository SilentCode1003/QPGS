import {
  changePassword,
  createUser,
  deleteUserById,
  getAllUsers,
  getUserById,
  updateUserById,
} from '@/handlers/v1/users.handler'
import { ensureAdmin, ensureLogin } from '@/middlewares/auth.middleware'
import express from 'express'

export const usersRouter = express.Router()

// Admin only
usersRouter.get('/', ensureLogin, ensureAdmin, getAllUsers)

// Admin only
usersRouter.post('/', ensureLogin, ensureAdmin, createUser)

// Admin and resource owner
usersRouter.get('/:userId', ensureLogin, getUserById)

// Admin only
usersRouter.patch('/:userId', ensureLogin, ensureAdmin, updateUserById)

// Admin only
usersRouter.delete('/:userId', ensureLogin, ensureAdmin, deleteUserById)

// Admin and user
usersRouter.post('/password', ensureLogin, changePassword)
