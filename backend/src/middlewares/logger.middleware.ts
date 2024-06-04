import morgan, { type StreamOptions } from 'morgan'
import { logger } from '../utils/logger.util.js'

const stream: StreamOptions = {
  write: (message) => logger.http(message),
}

export const loggerMiddleware = morgan('common', { stream })
