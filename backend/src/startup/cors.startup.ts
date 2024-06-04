import cors from 'cors'
import type { Express } from 'express'
import { config } from '../config/env.config'
import { logger } from '../utils/logger.util'

const origin =
  config.NODE_ENV === 'production' ? [config.FRONT_END_ORIGIN] : ['http://localhost:3000']

const options: cors.CorsOptions = {
  // Only allow these clients
  // This is mainly what url the frontend in the browser sees
  // You can also add the ip of another server
  origin,
  // Uncomment if you want the client to send cookies
  credentials: true,
}

export const initCors = (app: Express) => {
  logger.info(`Allowed origins are: ${origin}`)
  app.use(cors(options))
}
