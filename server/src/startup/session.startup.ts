import { CONFIG_CONSTANT } from '@/config/constants.config'
import { CONFIG_ENV } from '@/config/env.config'
import MongoStore from 'connect-mongo'
import type { Express } from 'express'
import session from 'express-session'

const options: session.SessionOptions = {
  store: new MongoStore({ mongoUrl: CONFIG_ENV.MONGODB_URL }),
  name: CONFIG_CONSTANT.SESSION_COOKIE_NAME,
  secret: CONFIG_ENV.SERVER_SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true, // Always set to true to avoid XSS
    sameSite: 'lax', // The best setting would be 'strict' but server and client need to be served in same site. See: https://web.dev/articles/same-site-same-origin
    secure: CONFIG_ENV.SERVER_IS_HTTPS,
    maxAge: 1000 * 60 * 60 * 9, // 9 Hours
  },
}

export const initSession = (app: Express) => {
  app.use(session(options))
}
