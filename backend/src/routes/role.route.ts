import express from 'express'
import { createRole, getRole, getRoles } from '../handlers/role.handler'
import { isAdmin } from '../middlewares/auth.middleware'

export const roleRouter = express.Router()

// Anyone can get all roles info
roleRouter.get('/', getRoles)

// Only admin can create a role
roleRouter.post('/', isAdmin, createRole)

// Anyone can get a role info
roleRouter.get('/:id', getRole)

// No one can update a role
// roleRoute.put('/:id')

// No one should be able to delete a role
// roleRoute.delete('/:id')
