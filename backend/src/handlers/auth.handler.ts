import type { RequestHandler } from 'express'
import { prisma } from '../db/prisma.js'
import { z } from 'zod'
import bcrypt from 'bcrypt'

export const getMe: RequestHandler = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.session.user!.id, // We are sure that req.session.user exists because of isLogged middleware
      },
      omit: {
        password: true,
      },
    })
    res.status(200).json({ data: user })
  } catch (err) {
    next(err)
  }
}

export const login: RequestHandler = async (req, res, next) => {
  const bodySchema = z.object({
    username: z.string().min(3),
    password: z.string().min(3),
  })

  const validatedBody = bodySchema.safeParse(req.body)

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.errors })
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

    const isMatch = await bcrypt.compare(validatedBody.data.password, user.password)

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const { password, ...userWithoutPass } = user

    req.session.user = userWithoutPass

    res.status(200).json({ data: userWithoutPass })
  } catch (err) {
    next(err)
  }
}

export const logout: RequestHandler = async (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Cannot destroy session' })
    }

    res.sendStatus(204)
  })
}
