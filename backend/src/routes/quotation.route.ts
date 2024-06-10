import express from 'express'
import {
  approveQuotation,
  createQuotation,
  deleteQuotation,
  getApprovedQuotationsByUserId,
  getCreatedQuotationsByUserId,
  getQuotation,
  getQuotations,
  updateQuotation,
} from '../handlers/quotation.handler'
import {
  isAdmin,
  naive_isQuotationOwnerOrAdmin,
  naive_isQuotationUserOrAdmin,
} from '../middlewares/auth.middleware'
import { userRouter } from './user.route'

export const quotationRouter = express.Router()

// Only admin can get all quotations
quotationRouter.get('/', isAdmin, getQuotations)

// Admin can view a user's quotations
// Users can get their own quotations
userRouter.get(
  '/:userId/created-quotations',
  naive_isQuotationUserOrAdmin,
  getCreatedQuotationsByUserId,
) // /users/1/created-quotations

// Only admin can view an admin's approved quotations
userRouter.get('/:userId/approved-quotations', isAdmin, getApprovedQuotationsByUserId) // /users/1/approved-quotations

// Anyone can create a quotation
quotationRouter.post('/', createQuotation)

// Admin can view anyone's quotation
// User can only view his/her own quotation
quotationRouter.get('/:id', naive_isQuotationOwnerOrAdmin, getQuotation)

// Admin can edit anyone's quotation
// User can only edit his/her own PENDING quotation
quotationRouter.put('/:id', naive_isQuotationOwnerOrAdmin, updateQuotation)

// Only admin can approve
quotationRouter.patch('/:id/approve', isAdmin, approveQuotation)

// Only admin can delete
quotationRouter.delete('/:id', isAdmin, deleteQuotation)
