import { getCurrentUser, login, logout } from '@/handlers/v1/auth.handler'
import { ensureLogin } from '@/middlewares/auth.middleware'
import express from 'express'

export const authRouter = express.Router()

authRouter.get('/me', ensureLogin, getCurrentUser)

authRouter.post('/login', login)

authRouter.delete('/logout', logout)
