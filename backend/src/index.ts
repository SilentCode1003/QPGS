import express from 'express'
import './config/env.config.js'
import { config } from './config/env.config.js'
import './db/prisma.js'
import { prisma } from './db/prisma.js'
import { notFoundHandler } from './middlewares/404.middleware.js'
import { errorHandler } from './middlewares/error.middleware.js'
import { loggerMiddleware } from './middlewares/logger.middleware.js'
import { initCors } from './startup/cors.startup.js'
import { initRoutes } from './startup/route.startup.js'
import { initSession } from './startup/session.startup.js'
import { logger } from './utils/logger.util.js'

const app = express()

const startServer = () => {
  logger.info(`---------- Running on ${config.NODE_ENV} environment ----------`)

  logger.info('   Adding CORS middleware')
  initCors(app)

  logger.info('   Adding Session middlware')
  initSession(app)

  logger.info('   Adding JSON parser middleware')
  app.use(express.json())

  // If you intend to parse application/x-www-form-urlencoded content type
  // logger.info('   Adding form parser middleware')
  // app.use(express.urlencoded({extended: true}))

  logger.info('   Adding logger middleware')
  app.use(loggerMiddleware)

  logger.info('   Adding routes')
  initRoutes(app)

  logger.info('   Adding not found handler')
  app.use('*', notFoundHandler)

  logger.info('   Adding error handler')
  app.use(errorHandler)

  const server = app.listen(config.API_PORT, () => {
    logger.info(`Server listening on port ${config.API_PORT}`)
  })

  // Gracefully shutdown
  // PM2 sends SIGINT signal to stop a process, change the signal type depending on your implementation
  process.on('SIGINT', async () => {
    logger.info('---------- SIGINT signal recieved, Closing the application ----------')
    await prisma.$disconnect()
    server.close()
  })
}

startServer()
