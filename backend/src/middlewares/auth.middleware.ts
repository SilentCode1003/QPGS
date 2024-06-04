import type { RequestHandler } from 'express'

export const ensureLogin: RequestHandler = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'You need to be logged in first' })
  }

  next()
}
