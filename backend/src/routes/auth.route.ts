import express from 'express'
import { getMe, login, logout } from '../handlers/auth.handler'

export const authRouter = express.Router()

// Only logged in user can get his/her own info
authRouter.get('/me', getMe)

// Anyone can login
authRouter.post('/login', login)

// Anyone can logout
authRouter.delete('/logout', logout)
