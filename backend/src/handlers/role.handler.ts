import type { RequestHandler } from 'express'
import { prisma } from '../db/prisma'
import { numberIdParamSchema } from '../schemas/param.schema'
import { createRoleSchema } from '../schemas/role.schema'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

export const getRoles: RequestHandler = async (req, res, next) => {
  try {
    const roles = await prisma.role.findMany()

    res.status(200).json({ data: roles })
  } catch (err) {
    next(err)
  }
}

export const createRole: RequestHandler = async (req, res, next) => {
  const validatedBody = createRoleSchema.safeParse(req.body)

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.format() })
  }

  try {
    const role = await prisma.role.create({
      data: {
        ...validatedBody.data,
      },
    })

    res.status(200).json({ data: role })
  } catch (err) {
    next(err)
  }
}

export const getRole: RequestHandler = async (req, res, next) => {
  const validatedId = numberIdParamSchema.safeParse(req.params)

  if (!validatedId.success) {
    return res.status(400).json({ message: validatedId.error.format() })
  }

  try {
    const role = await prisma.role.findUnique({
      where: {
        id: validatedId.data.id,
      },
    })

    if (!role) {
      return res.status(404).json({ message: 'Role not found' })
    }

    res.status(200).json({ data: role })
  } catch (err) {
    next(err)
  }
}
