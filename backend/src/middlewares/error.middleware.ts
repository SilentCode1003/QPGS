import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import type { ErrorRequestHandler } from 'express'
import { logger } from '../utils/logger.util.js'

// We should format whatever error to the
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof SyntaxError) {
    return res.status(400).json({ message: 'JSON Syntax error' })
  }

  // Handle Prisma errors
  // https://www.prisma.io/docs/orm/reference/error-reference#error-codes
  if (err instanceof PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P1001':
        return res.status(500).json({ message: 'Cannot connect to database' })
      case 'P1017':
        return res.status(500).json({ message: 'Database has closed the connection' })
      case 'P2002':
        return res.status(400).json({ message: `${err.meta?.target} is already used` })
      case 'P2003':
        return res.status(400).json({ message: `${err.meta?.target} does not exist` })
      case 'P2025':
        return res.status(404).json({ message: 'Record to update/delete not found ' })
      default:
        return res.status(400).json({
          message: `Please handle prisma error code: ${err.code}`,
        })
    }
  }

  // If we didn't handle any of the error types above
  logger.error(JSON.stringify(err))
  res.status(500).json({ message: err })
}
