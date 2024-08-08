import { Logger } from '@/utils/logger.util'
import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()

prisma
  .$connect()
  .then(() => {
    Logger.info('Prisma client connected successfully')
  })
  .catch((error) => {
    Logger.error('Prisma client cannot connect', error)
  })
