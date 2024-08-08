import { CONFIG_ENV } from '@/config/env.config'
import { Logger } from '@/utils/logger.util'
import type { Express } from 'express'

export const initProxy = (app: Express) => {
  if (CONFIG_ENV.NODE_ENV === 'production') {
    Logger.info('Set trust proxy to 1')
    app.set('trust proxy', 1)
  } else {
    Logger.info('Noop on trust proxy')
  }
}
