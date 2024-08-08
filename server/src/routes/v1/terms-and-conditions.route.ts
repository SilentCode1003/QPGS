import {
  createTermsAndConditions,
  deleteTermsAndConditions,
  getAllTermsAndConditions,
  getTermsAndConditionsById,
  updateTermsAndConditions,
} from '@/handlers/v1/terms-and-conditions.handler'
import { ensureAdmin, ensureLogin } from '@/middlewares/auth.middleware'
import express from 'express'

export const termsAndConditionsRouter = express.Router()

// Admin and user
termsAndConditionsRouter.get('/', ensureLogin, getAllTermsAndConditions)

// Admin only
termsAndConditionsRouter.post('/', ensureLogin, ensureAdmin, createTermsAndConditions)

// Admin and user
termsAndConditionsRouter.get('/:termsAndConditionsId', ensureLogin, getTermsAndConditionsById)

// Admin only
termsAndConditionsRouter.patch(
  '/:termsAndConditionsId',
  ensureLogin,
  ensureAdmin,
  updateTermsAndConditions,
)

// Admin only
termsAndConditionsRouter.delete(
  '/:termsAndConditionsId',
  ensureLogin,
  ensureAdmin,
  deleteTermsAndConditions,
)
