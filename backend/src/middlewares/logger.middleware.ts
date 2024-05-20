import morgan, { type StreamOptions } from 'morgan'
import { config } from '../config/env.config.js'
import { logger } from '../utils/logger.util.js'

const morganFormat = config.NODE_ENV === 'production' ? 'combined' : 'dev'

const stream: StreamOptions = {
  write: (message) => logger.http(message),
}

export const loggerMiddleware = morgan(morganFormat, { stream })
