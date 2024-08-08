import { CONFIG_ENV } from '@/config/env.config'
import { Logger } from '@/utils/logger.util'
import cors from 'cors'
import type { Express } from 'express'

const origin: string[] =
  CONFIG_ENV.NODE_ENV === 'development'
    ? ['http://localhost:5173', 'http://localhost:3001']
    : CONFIG_ENV.CLIENT_ORIGIN.split(',')

const options: cors.CorsOptions = {
  credentials: true, // Accept cookies
  exposedHeaders: ['Content-Disposition'],
  origin,
}

export const initCors = (app: Express) => {
  Logger.info(`Adding ${origin} on allowed origins`)
  app.use(cors(options))
}
