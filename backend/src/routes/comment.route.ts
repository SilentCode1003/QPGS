import express from 'express'
import { createComment } from '../handlers/comment.handler'
import { isLoggedIn } from '../middlewares/auth.middleware'

export const commentRouter = express.Router()

// commentRouter.get('/', isLoggedIn)
commentRouter.post('/', isLoggedIn, createComment)
// commentRouter.put('/:id', isLoggedIn)
// commentRouter.delete('/:id', isLoggedIn)
