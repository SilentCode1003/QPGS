import type { RequestHandler } from 'express'
import { CONSTANT } from '../config/constant.config'

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
