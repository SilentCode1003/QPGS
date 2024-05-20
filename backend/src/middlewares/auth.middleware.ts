import type { RequestHandler } from 'express'

export const isLoggedIn: RequestHandler = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'You are not logged in' })
  }

  next()
}
