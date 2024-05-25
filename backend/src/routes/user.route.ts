import express from 'express'
import { createUser, deleteUser, getUser, getUsers, updateUser } from '../handlers/user.handler.js'
import { isLoggedIn } from '../middlewares/auth.middleware.js'
import { isAdmin, isAuthorized } from '../middlewares/role.middleware.js'

export const userRouter = express.Router()

userRouter.get('/', isLoggedIn, isAdmin, getUsers)
userRouter.post('/', isLoggedIn, isAdmin, createUser)
userRouter.get('/:id', isLoggedIn, isAuthorized, getUser)
userRouter.put('/:id', isLoggedIn, isAuthorized, updateUser)
userRouter.delete('/:id', isLoggedIn, isAuthorized, deleteUser)
