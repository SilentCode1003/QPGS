import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import type { ErrorRequestHandler } from 'express'
import { logger } from '../utils/logger.util.js'
import { formatPrismaErrorTarget } from '../utils/format.util.js'

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof SyntaxError) {
    return res.status(400).json({ message: 'JSON Syntax error' })
  }

  // Handle Prisma errors
  // https://www.prisma.io/docs/orm/reference/error-reference#error-codes
  if (err instanceof PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P1001':
        // Happens if db is closing
        return res.status(500).json({ message: 'Cannot connect to database' })
      case 'P1017':
        // Happens if db is closed
        return res.status(500).json({ message: 'Database has closed the connection' })
      case 'P2002':
        // Happens in create and update when unique key already exists
        return res.status(400).json({
          message: `${formatPrismaErrorTarget(err.meta?.target as string)} already exists`,
        })
      case 'P2003':
        const word = formatPrismaErrorTarget(err.meta?.field_name as string)
        // Happens in create and update when a foreign key to insert does not exist
        // Or when in delete where the current id is a foreign key of other record
        return res.status(400).json({
          message: `${word} does not exist or ${word} is currently being used`,
        })
      case 'P2025':
        // Happens if the resource going to be updated/deleted does not exist
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
