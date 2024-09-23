import { CONFIG_ENV } from '@/config/env.config'
import { Logger } from '@/utils/logger.util'
import cors from 'cors'
import type { Express } from 'express'

const origin: string[] =
  CONFIG_ENV.NODE_ENV === 'development'
    ? CONFIG_ENV.CLIENT_ORIGIN_DEV.split(',')
    : CONFIG_ENV.CLIENT_ORIGIN_PROD.split(',')

const options: cors.CorsOptions = {
  credentials: true, // Accept cookies
  exposedHeaders: ['Content-Disposition'], // To expose file name to client
  origin,
}

export const initCors = (app: Express) => {
  Logger.info(`Adding ${origin} on allowed origins`)
  app.use(cors(options))
}
