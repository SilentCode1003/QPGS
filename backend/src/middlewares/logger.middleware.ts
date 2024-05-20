import morgan, { type StreamOptions } from 'morgan'
import { logger } from '../utils/logger.util.js'

const morganFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev'

const stream: StreamOptions = {
  write: (message) => logger.http(message),
}

export const loggerMiddleware = morgan(morganFormat, { stream })
