/* eslint-disable @typescript-eslint/no-unused-vars */
import { CONFIG_CONSTANT } from '@/config/constants.config'
import { prisma } from '@/db/prisma'
import { loginDto } from '@/dtos/v1/login/login-body.dto'
import bcrypt from 'bcrypt'
import type { RequestHandler } from 'express'

export const getCurrentUser: RequestHandler = (req, res) => {
  res.status(200).json({ data: req.session.user })
}

export const login: RequestHandler = async (req, res, next) => {
  const validatedBody = loginDto.safeParse(req.body)

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.errors })
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        username: validatedBody.data.username,
        is_active: true,
      },
      include: {
        role: true,
      },
    })

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const passwordIsMatch = await bcrypt.compare(validatedBody.data.password, user.password)

    if (!passwordIsMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const { password, signature, ...userWithoutPassword } = user

    req.session.user = userWithoutPassword

    res.json({ data: userWithoutPassword })
  } catch (error) {
    next(error)
  }
}

export const logout: RequestHandler = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      return next(err)
    }

    res.clearCookie(CONFIG_CONSTANT.SESSION_COOKIE_NAME)

    res.status(200).json({ data: {} })
  })
}
