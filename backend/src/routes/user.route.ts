import express from 'express'
import { createUser, deleteUser, getUser, getUsers, updateUser } from '../handlers/user.handler.js'

export const userRouter = express.Router()

userRouter.get('/', getUsers)
userRouter.post('/', createUser)
userRouter.get('/:id', getUser)
userRouter.put('/:id', updateUser)
userRouter.delete('/:id', deleteUser)
