import { createRole, getAllRoles, getRoleById, updateRoleById } from '@/handlers/v1/roles.handler'
import { ensureAdmin, ensureLogin } from '@/middlewares/auth.middleware'
import express from 'express'

export const rolesRouter = express.Router()

// Admin only
rolesRouter.get('/', ensureLogin, ensureAdmin, getAllRoles)

// Admin only
rolesRouter.post('/', ensureLogin, ensureAdmin, createRole)

// Admin only
rolesRouter.get('/:roleId', ensureLogin, ensureAdmin, getRoleById)

// Admin only
rolesRouter.put('/:roleId', ensureLogin, ensureAdmin, updateRoleById)
