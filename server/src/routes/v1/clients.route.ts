import {
  createClient,
  deleteClient,
  getAllClients,
  getClientById,
  updateClient,
} from '@/handlers/v1/clients.handler'
import { ensureAdmin, ensureLogin } from '@/middlewares/auth.middleware'
import express from 'express'

export const clientsRouter = express.Router()

// Admin and user
clientsRouter.get('/', ensureLogin, getAllClients)

// Admin and user
clientsRouter.post('/', ensureLogin, createClient)

// Admin and user
clientsRouter.get('/:clientId', ensureLogin, getClientById)

// Admin
clientsRouter.patch('/:clientId', ensureLogin, ensureAdmin, updateClient)

// Admin
clientsRouter.delete('/:clientId', ensureLogin, ensureAdmin, deleteClient)
