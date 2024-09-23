import { CONFIG_ENV } from '@/config/env.config'
import { Logger } from '@/utils/logger.util'
import mongoose from 'mongoose'

export const mongooseClient = mongoose
  .connect(CONFIG_ENV.MONGODB_URL)
  .then((m) => {
    Logger.info('Mongoose client connected successfully')
    return m
  })
  .then((m) => m.connection.getClient())
  .catch((error) => {
    Logger.error('Error connecting to MongoDB: ', error)
    process.exit(1)
  })
