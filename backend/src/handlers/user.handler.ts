import bcrypt from 'bcrypt'
import type { RequestHandler } from 'express'
import { prisma } from '../db/prisma.js'
import { numberIdParamSchema } from '../schemas/param.schema.js'
import { createUserSchema, updateUserSchema } from '../schemas/user.schema.js'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

export const getUsers: RequestHandler = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      omit: {
        password: true,
      },
    })

    res.status(200).json({ data: users })
  } catch (err) {
    console.error('Please handle: ', err)
    res.status(400).json(err)
  }
}

export const createUser: RequestHandler = async (req, res, next) => {
  const validatedBody = createUserSchema.safeParse(req.body)

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.format() })
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
    if (err instanceof PrismaClientKnownRequestError) {
      switch (err.code) {
        case 'P2002':
          console.log('Username or email is already used')
          return res.status(400).json({ message: 'Username or email is already used' })
        case 'P2003':
          console.log('Cannot create user because role id does not exist')
          return res.status(400).json({ message: 'Role id does not exist' })
        default:
          console.log('Please handle: ', err)
          return res.status(400).json(err)
      }
    }

    console.error('Please handle: ', err)
    res.status(400).json(err)
  }
}

export const getUser: RequestHandler = async (req, res, next) => {
  const validatedId = numberIdParamSchema.safeParse(req.params)

  if (!validatedId.success) {
    return res.status(400).json({ message: validatedId.error.format() })
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: validatedId.data.id,
      },
    })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.status(200).json({ data: user })
  } catch (err) {
    console.error('Please handle: ', err)
    res.status(400).json(err)
  }
}

export const updateUser: RequestHandler = async (req, res, next) => {
  const validatedId = numberIdParamSchema.safeParse(req.params)

  if (!validatedId.success) {
    return res.status(400).json({ message: validatedId.error.format() })
  }

  const validatedBody = updateUserSchema.safeParse(req.body)

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.format() })
  }
  try {
    const user = await prisma.user.update({
      where: {
        id: validatedId.data.id,
      },
      data: {
        ...validatedBody.data,
        password:
          validatedBody.data.password && (await bcrypt.hash(validatedBody.data.password, 10)),
      },
      omit: {
        password: true,
      },
    })

    res.status(200).json({ data: user })
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      switch (err.code) {
        case 'P2002':
          console.log('Username or email is already used')
          return res.status(400).json({ message: 'Username or email is already used' })
        case 'P2003':
          console.log('Cannot create user because role id does not exist')
          return res.status(400).json({ message: 'Role id does not exist' })
        case 'P2025':
          console.log('User to update not found')
          return res.status(404).json({ message: 'User to update not found' })
        default:
          console.log('Please handle: ', err)
          return res.status(400).json(err)
      }
    }

    console.error('Please handle: ', err)
    res.status(400).json(err)
  }
}

export const deleteUser: RequestHandler = async (req, res, next) => {
  const validatedId = numberIdParamSchema.safeParse(req.params)

  if (!validatedId.success) {
    return res.status(400).json({ message: validatedId.error.format() })
  }

  try {
    const user = await prisma.user.delete({
      where: {
        id: validatedId.data.id,
      },
    })

    res.status(200).json({ data: user })
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      switch (err.code) {
        case 'P2025':
          console.log('User to delete not found')
          return res.status(404).json({ message: 'User to delete not found' })
        default:
          console.log('Please handle: ', err)
          return res.status(400).json(err)
      }
    }

    console.error('Please handle: ', err)
    res.status(400).json(err)
  }
}
