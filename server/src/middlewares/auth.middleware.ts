import { CONFIG_CONSTANT } from '@/config/constants.config'
import type { RequestHandler } from 'express'

export const ensureLogin: RequestHandler = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  next()
}

export const ensureAdmin: RequestHandler = (req, res, next) => {
  if (!req.session.user) {
    throw new Error('ensureLogin is used on a route without ensureLogin middleware')
  }

  if (req.session.user.role.name !== CONFIG_CONSTANT.DB_ROLE_ADMIN_NAME) {
    return res.status(403).json({ message: 'Forbidden' })
  }

  next()
}
