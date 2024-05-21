import cors from 'cors'
import type { Express } from 'express'
import { config } from '../config/env.config'
import { logger } from '../utils/logger.util'

const frontendHostPort = `${config.FRONTEND_HOST}:${config.FRONTEND_PORT}`

const options: cors.CorsOptions = {
  // Only allow these clients
  // This is mainly what url the frontend in the browser sees
  // You can also add the ip of another server
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:3001',
    frontendHostPort,
  ],
  // Set to true if you want the client to send cookies
  credentials: true,
}

export const initCors = (app: Express) => {
  logger.info(`Adding frontend url: ${frontendHostPort} to allowed origins`)
  app.use(cors(options))
}
