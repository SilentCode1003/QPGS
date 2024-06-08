import express from 'express'
import { createUser, deleteUser, getUser, getUsers, updateUser } from '../handlers/user.handler.js'
import { isAdmin, naive_isUserOrAdmin } from '../middlewares/auth.middleware.js'

export const userRouter = express.Router()

// Only admin can access the list of users
userRouter.get('/', isAdmin, getUsers)

// Only admin can create a user
userRouter.post('/', isAdmin, createUser)

// User can only access his/her own info
// Admin can access anyone's info
userRouter.get('/:id', naive_isUserOrAdmin, getUser)

// User can only update his/her own info
// Admin can update anyone's info
userRouter.patch('/:id', naive_isUserOrAdmin, updateUser)

// Only admin can delete a user
userRouter.delete('/:id', isAdmin, deleteUser)
