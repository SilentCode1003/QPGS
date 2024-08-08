import { CONFIG_CONSTANT } from '@/config/constants.config'
import { CONFIG_ENV } from '@/config/env.config'
import { prisma } from '@/db/prisma'
import { notFoundMiddleware } from '@/middlewares/404.middleware'
import { errorMiddleware } from '@/middlewares/error.middleware'
import { httpLoggerMiddleware } from '@/middlewares/http-logger.middleware'
import { initCors } from '@/startup/cors.startup'
import { initProxy } from '@/startup/proxy.startup'
import { initRoutes } from '@/startup/routes.startup'
import { initSession } from '@/startup/session.startup'
import { Logger } from '@/utils/logger.util'
import express from 'express'

const app = express()
const PORT = CONFIG_ENV.SERVER_PORT

const startServer = () => {
  Logger.info('-------------------- Starting server --------------------')
  Logger.info(`Running on ${CONFIG_ENV.NODE_ENV} environment`)

  Logger.info('Adding json parser')
  app.use(express.json({ limit: CONFIG_CONSTANT.JSON_FILE_SIZE_LIMIT }))

  Logger.info('Adding http logger middleware')
  app.use(httpLoggerMiddleware)

  Logger.info('Setting up proxy')
  initProxy(app)

  Logger.info('Setting up CORS')
  initCors(app)

  Logger.info('Setting up session')
  initSession(app)

  Logger.info('Setting up routes')
  initRoutes(app)

  Logger.info('Adding not found middleware')
  app.use(notFoundMiddleware)

  Logger.info('Adding error middleware')
  app.use(errorMiddleware)

  const server = app.listen(PORT, () => {
    Logger.info(`Server listening on port ${PORT}`)
  })

  process.on('SIGINT', () => {
    Logger.info('SIGINT signal received, Closing the application')
    prisma.$disconnect().then(() => {
      Logger.info('Prisma disconnected')
      server.close()
      Logger.info('Server closed')
      process.exit(0)
    })
  })
}

startServer()
