import type { Express } from 'express'
import express from 'express'
import path from 'node:path'
import { isLoggedIn } from '../middlewares/auth.middleware'

export const initStatic = (app: Express) => {
  app.use('/reports', isLoggedIn)
  app.use('/reports', express.static(path.join(__dirname, '../reports')))
}
