import type { Express } from 'express'
import session from 'express-session'
import { config } from '../config/env.config.js'

const maxAge = 1000 * 60 * 60 * 9 // 9 Hours

const options: session.SessionOptions = {
  secret: config.API_SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax', // The best setting would be 'strict' but that requires the frontend to have the same domain as the backend(this api)
    // lax only sends cookie to GET, and HEAD requests to different origin
    // none always sends cookie to a different origin but needs sameSite: true
    secure: false, // This depends if the domain this server will be deployed have https
    maxAge,
  },
}

export const initSession = (app: Express) => {
  app.use(session(options))
}
