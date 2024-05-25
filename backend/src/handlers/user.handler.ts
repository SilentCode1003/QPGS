import type { RequestHandler } from 'express'
import { z } from 'zod'
import { prisma } from '../db/prisma.js'
import bcrypt from 'bcrypt'

// I can type the req body, params, and query but I don't know if its worth the time, readability, and complexity
// I can also type the response body but it's the same issue as above
export const getUsers: RequestHandler = async (req, res, next) => {
  try {
    // Making the result variable name just 'user' or 'users' make ide autocomplete easier
    const users = await prisma.user.findMany({
      omit: {
        password: true,
        role_id: true,
      },
      include: {
        role: {
          select: {
            name: true,
          },
        },
      },
    })

    // The format of the response should be a json with a data key
    // e.g.
    // "{
    //   "data": {
    //     "id": 1,
    //     "username": "john"
    //   }
    // }"
    res.status(200).json({ data: users })
  } catch (err) {
    // Name the errors err to "save time"

    // Just pass the err to the error handler
    // The next(err) statement is annoying but it will change in version 5 of express
    next(err)
  }
}

export const createUser: RequestHandler = async (req, res, next) => {
  // Schemas should probably in a separate folder like schemas
  // I will just create schemas for handlers that need it
  const bodySchema = z
    .object({
      first_name: z.string().min(3),
      last_name: z.string().min(2).optional(),
      email: z.string().email(),
      username: z.string().min(3),
      password: z.string().min(3),
      role_id: z.number(),
      signature: z.string().min(1).optional(),
      job_title: z.string().min(1),
    })
    .strict() // Make it strict because why not

  const validatedBody = bodySchema.safeParse(req.body)

  if (!validatedBody.success) {
    // Error response should be a json with a message key
    // The value could be any kind
    return res.status(400).json({ message: validatedBody.error.errors })
  }

  try {
    const user = await prisma.user.create({
      data: {
        ...validatedBody.data,
        password: await bcrypt.hash(validatedBody.data.password, 10),
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

export const getUser: RequestHandler = async (req, res, next) => {
  // Make sure that id param is a number
  // Coerce it first because params are always a string
  const idSchema = z.object({
    id: z.coerce.number(),
  })

  const validatedId = idSchema.safeParse(req.params)

  if (!validatedId.success) {
    return res.status(400).json({ message: validatedId.error.errors })
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: validatedId.data.id,
      },
    })

    // We can either send a not found response or just send a null data
    // But because we're a responsible developer we will send a not found response
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.status(200).json({ data: user })
  } catch (err) {
    next(err)
  }
}

export const updateUser: RequestHandler = async (req, res, next) => {
  // Check if req.params.id is a number then check if req.body is valid

  const idSchema = z.object({
    id: z.coerce.number(),
  })

  const validatedId = idSchema.safeParse(req.params)

  if (!validatedId.success) {
    return res.status(400).json({ message: validatedId.error.errors })
  }

  const bodySchema = z
    .object({
      first_name: z.string().min(3),
      last_name: z.string().min(2).optional(),
      email: z.string().email(),
      username: z.string().min(3),
      role_id: z.number(),
      signature: z.string().min(1).optional(),
      job_title: z.string().min(1),
      // Making fields optional really depends on the requirements of the application
      // Imagine if we always require a password to update a user's username, then we will always need to get the previous password and that's not ideal
      password: z.string().min(3).optional(),
    })
    .strict()

  const validatedBody = bodySchema.safeParse(req.body)

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.errors })
  }

  try {
    const user = await prisma.user.update({
      where: {
        id: validatedId.data.id,
      },
      data: {
        ...validatedBody.data,
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

export const deleteUser: RequestHandler = async (req, res, next) => {
  const idSchema = z.object({
    id: z.coerce.number(),
  })

  const validatedId = idSchema.safeParse(req.params)

  if (!validatedId.success) {
    return res.status(400).json({ message: validatedId.error.errors })
  }

  try {
    const user = await prisma.user.delete({
      where: {
        id: validatedId.data.id,
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
