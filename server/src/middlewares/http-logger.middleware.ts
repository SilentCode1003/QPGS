/**
 * Passes morgan logs to winston Logger
 */

import { Logger } from '@/utils/logger.util'
import morgan from 'morgan'

const stream: morgan.StreamOptions = {
  write: (message) => Logger.http(message),
}

export const httpLoggerMiddleware = morgan('common', { stream })
