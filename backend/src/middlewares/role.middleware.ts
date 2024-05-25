import type { RequestHandler } from 'express'
import { z } from 'zod'

export const isAdmin: RequestHandler = (req, res, next) => {
  if (!req.session.user) {
    throw new Error('isAdmin middleware is used without using the isLoggedIn middleware first')
  }

  // TODO: Make the magic number a config
  if (req.session.user.role_id !== 3) {
    return res.status(403).json({ message: 'Not authorized' })
  }

  next()
}

export const isAuthorized: RequestHandler = (req, res, next) => {
  if (!req.session.user) {
    throw new Error('isAuthorized middleware is used without using the isLoggedIn middleware first')
  }

  // If the logged in user is an admin
  if (req.session.user.role_id === 3) {
    return next()
  }

  const idSchema = z.object({
    id: z.coerce.number(),
  })

  const validatedId = idSchema.safeParse(req.params)

  if (!validatedId.success) {
    return res.status(400).json({ message: validatedId.error.errors })
  }

  // Don't allow access to different resource id except the owner's id
  if (req.session.user.id !== validatedId.data.id) {
    return res.status(403).json({ message: 'Not authorized' })
  }

  next()
}
