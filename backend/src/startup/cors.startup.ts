import type { Express } from 'express'
import cors from 'cors'

const options: cors.CorsOptions = {
  // Only allow these clients
  // This is mainly what url the frontend in the browser sees
  // You can also add the ip of another server
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:3001'],
  // Set to true if you want the client to send cookies
  credentials: true,
}

export const initCors = (app: Express) => {
  app.use(cors(options))
}
