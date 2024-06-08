import type { client } from '@prisma/client'
import type { RequestHandler } from 'express'
import { CONSTANT } from '../config/constant.config'
import { prisma } from '../db/prisma'
import { numberIdParamSchema } from '../schemas/param.schema'

export const ensureLogin: RequestHandler = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'You need to be logged in first' })
  }

  next()
}

export const isAdmin: RequestHandler = (req, res, next) => {
  if (!req.session.user) {
    throw new Error(`isAdmin middleware is used on route that doesn't use ensureLogin middleware`)
  }

  if (req.session.user.role_id === CONSTANT.DB_ADMIN_ROLE_ID) {
    next()
  } else {
    res.status(403).json({ message: 'Operation not allowed' })
  }
}

export const naive_isClientCreatorOrAdmin: RequestHandler = async (req, res, next) => {
  if (!req.session.user) {
    throw new Error(`isAdmin middleware is used on route that doesn't use ensureLogin middleware`)
  }

  if (req.session.user.id === CONSTANT.DB_ADMIN_ROLE_ID) {
    next()
    return
  }

  const validatedId = numberIdParamSchema.safeParse(req.params)

  if (!validatedId.success) {
    return res.status(400).json({ message: validatedId.error.format() })
  }

  let client: client | null = null

  try {
    client = await prisma.client.findUnique({ where: { id: validatedId.data.id } })
  } catch (err) {
    next(err)
  }

  if (client?.created_by_id !== req.session.user.id) {
    return res.status(403).json({ message: 'Operation not allowed' })
  }

  next()
}

export const naive_isUserOrAdmin: RequestHandler = async (req, res, next) => {
  if (!req.session.user) {
    throw new Error(`isAdmin middleware is used on route that doesn't use ensureLogin middleware`)
  }

  if (req.session.user.id === CONSTANT.DB_ADMIN_ROLE_ID) {
    next()
    return
  }

  const validatedId = numberIdParamSchema.safeParse(req.params)

  if (!validatedId.success) {
    return res.status(400).json({ message: validatedId.error.format() })
  }

  if (validatedId.data.id !== req.session.user.id) {
    return res.status(403).json({ message: 'Operation not allowed' })
  }

  next()
}
