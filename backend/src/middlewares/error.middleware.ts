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
      // There should be 38 codes (P2000 - P2037) but because we're an irresponsible programmer, we will just let the error show up first before handling it
      case 'P2025':
        return res.status(404).json({ message: 'Record to delete not found ' })
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
