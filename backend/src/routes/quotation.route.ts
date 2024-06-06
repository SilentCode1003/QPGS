import express from 'express'
import { userRouter } from './user.route'
import {
  getApprovedQuotationsByUserId,
  getCreatedQuotationsByUserId,
  getQuotations,
} from '../handlers/quotation.handler'

export const quotationRouter = express.Router()

// Only admin can get all quotations
quotationRouter.get('/', getQuotations)

// Admin can view a user's quotations
// Users can get their own quotations
userRouter.get('/:userId/created-quotations', getCreatedQuotationsByUserId) // /users/1/created-quotations

// Only admin can view an admin's approved quotations
userRouter.get('/:userId/approved-quotations', getApprovedQuotationsByUserId) // /users/1/approved-quotations

// Anyone can create a quotation
quotationRouter.post('/')

// Admin can view anyone's quotation
// User can only view his/her own quotation
quotationRouter.get('/:id')

// Admin can edit anyone's quotation
// User can only edit his/her own quotation
quotationRouter.put('/:id')

// Only admin can approve
quotationRouter.patch('/:id/approve')

// Only admin can delete
quotationRouter.delete('/:id')
