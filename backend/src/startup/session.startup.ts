import type { Express } from 'express'
import session from 'express-session'
import { config } from '../config/env.config.js'

const options: session.SessionOptions = {
  secret: config.API_SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}

export const initSession = (app: Express) => {
  app.use(session(options))
}
