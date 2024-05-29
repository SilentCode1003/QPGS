import express from 'express'
import {
  createClient,
  deleteClient,
  getClient,
  getClients,
  updateClient,
} from '../handlers/client.handler'
import { isLoggedIn } from '../middlewares/auth.middleware'
import { isAdmin } from '../middlewares/role.middleware'

export const clientRouter = express.Router()

clientRouter.get('/', isLoggedIn, getClients)
clientRouter.post('/', isLoggedIn, createClient)
clientRouter.get('/:id', isLoggedIn, getClient)
clientRouter.put('/:id', isLoggedIn, isAdmin, updateClient)
clientRouter.delete('/:id', isLoggedIn, isAdmin, deleteClient)
