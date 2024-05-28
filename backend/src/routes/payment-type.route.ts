import express from 'express'
import {
  createPaymentType,
  deletePaymentType,
  getPaymentType,
  getPaymentTypes,
  updatePaymentType,
} from '../handlers/payment-type.handler'
import { isLoggedIn } from '../middlewares/auth.middleware'
import { isAdmin } from '../middlewares/role.middleware'

export const paymentTypeRouter = express.Router()

paymentTypeRouter.get('/', isLoggedIn, getPaymentTypes)
paymentTypeRouter.post('/', isLoggedIn, isAdmin, createPaymentType)
paymentTypeRouter.get('/:id', isLoggedIn, getPaymentType)
paymentTypeRouter.put('/:id', isLoggedIn, isAdmin, updatePaymentType)
paymentTypeRouter.delete('/:id', isLoggedIn, isAdmin, deletePaymentType)
