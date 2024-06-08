import express from 'express'
import {
  createStatus,
  deleteStatus,
  getStatus,
  getStatuses,
  updateStatus,
} from '../handlers/status.handler'
import { isAdmin } from '../middlewares/auth.middleware'

export const statusRouter = express.Router()

// Anyone can get statuses info
statusRouter.get('/', getStatuses)

// Only admin can create status
statusRouter.post('/', isAdmin, createStatus)

// Anyone can get status info
statusRouter.get('/:id', getStatus)

// Only admin can edit status info
statusRouter.put('/:id', isAdmin, updateStatus)

// Only admin can delete a status
statusRouter.delete('/:id', isAdmin, deleteStatus)
