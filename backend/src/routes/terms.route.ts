import express from 'express'
import {
  createTermsAndConditions,
  deleteTermsAndConditions,
  getTermsAndConditions,
  getTermsAndConditionsById,
  updateTermsAndConditions,
} from '../handlers/terms.handler'
import { isLoggedIn } from '../middlewares/auth.middleware'
import { isAdmin } from '../middlewares/role.middleware'

export const termsAndConditionRouter = express.Router()

termsAndConditionRouter.get('/', isLoggedIn, getTermsAndConditions)
termsAndConditionRouter.post('/', isLoggedIn, isAdmin, createTermsAndConditions)
termsAndConditionRouter.get('/:id', isLoggedIn, getTermsAndConditionsById)
termsAndConditionRouter.put('/:id', isLoggedIn, isAdmin, updateTermsAndConditions)
termsAndConditionRouter.delete('/:id', isLoggedIn, isAdmin, deleteTermsAndConditions)
