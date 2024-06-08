import express from 'express'
import { getMe, login, logout } from '../handlers/auth.handler'
import { ensureLogin } from '../middlewares/auth.middleware'

export const authRouter = express.Router()

// Only logged in user can get his/her own info
authRouter.get('/me', ensureLogin, getMe)

// Anyone can login
authRouter.post('/login', login)

// Anyone can logout
authRouter.delete('/logout', logout)
