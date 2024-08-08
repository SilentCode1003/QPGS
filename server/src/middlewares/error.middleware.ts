/* eslint-disable @typescript-eslint/no-unused-vars */
import { Logger } from '@/utils/logger.util'
import type { ErrorRequestHandler } from 'express'

export const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof SyntaxError) {
    return res.status(400).json({ message: err.message })
  }

  Logger.error(JSON.stringify(err, Object.getOwnPropertyNames(err)))
  res.status(500).json({ message: 'Internal server error' })
}
