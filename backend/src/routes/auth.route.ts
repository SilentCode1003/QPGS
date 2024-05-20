import express from 'express'
import { getMe, login, logout } from '../handlers/auth.handler'
import { isLoggedIn } from '../middlewares/auth.middleware'

export const authRouter = express.Router()

authRouter.get('/me', isLoggedIn, getMe)
authRouter.post('/login', login)
authRouter.delete('/logout', isLoggedIn, logout)
