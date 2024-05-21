import cors from 'cors'
import type { Express } from 'express'
import { config } from '../config/env.config'
import { logger } from '../utils/logger.util'

const frontendUrl = `${config.FRONTEND_HOST}:${config.FRONTEND_PORT}`

// Only allow these clients
// This is mainly what url the frontend in the browser sees
// You can also add the ip of another server
const origin = config.NODE_ENV === 'production' ? [frontendUrl] : ['http://localhost:3001'] // url of next application

const options: cors.CorsOptions = {
  origin,
  // Set to true if you want the client to send cookies
  credentials: true,
}

export const initCors = (app: Express) => {
  logger.info(`Adding frontend url: ${frontendUrl} to allowed origins`)
  app.use(cors(options))
}
