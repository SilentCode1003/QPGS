import express from 'express'
import {
  createClient,
  deleteClient,
  getClient,
  getClients,
  updateClient,
} from '../handlers/client.handler'
import { naive_isClientCreatorOrAdmin } from '../middlewares/auth.middleware'

export const clientRouter = express.Router()

// Anyone can get clients information
clientRouter.get('/', getClients)

// Anyone can create a client
clientRouter.post('/', createClient)

// Anyone can get client info
clientRouter.get('/:id', getClient)

// The creator of the client can update
// Admin can update any client
clientRouter.patch('/:id', naive_isClientCreatorOrAdmin, updateClient)

// The creator of the client can delete his/her own entry
// Admin can delete any client
clientRouter.delete('/:id', naive_isClientCreatorOrAdmin, deleteClient)
