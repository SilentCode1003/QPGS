import bcrypt from 'bcrypt'
import type { RequestHandler } from 'express'
import { CONSTANT } from '../config/constant.config'
import { prisma } from '../db/prisma'
import { loginSchema } from '../schemas/auth.schema'

export const getMe: RequestHandler = async (req, res, next) => {
  res.status(200).json({ data: req.session.user })
}

export const login: RequestHandler = async (req, res, next) => {
  const validatedBody = loginSchema.safeParse(req.body)

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.format() })
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        username: validatedBody.data.username,
      },
    })

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const passwordIsMatch = await bcrypt.compare(validatedBody.data.password, user.password)

    if (!passwordIsMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const { password, ...userWithoutPassword } = user

    req.session.user = userWithoutPassword

    res.status(200).json({ data: userWithoutPassword })
  } catch (err) {
    next(err)
  }
}

export const logout: RequestHandler = async (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Cannot destroy session')
    }

    res.clearCookie(CONSTANT.SESSION_COOKIE_NAME)

    res.sendStatus(204)
  })
}
