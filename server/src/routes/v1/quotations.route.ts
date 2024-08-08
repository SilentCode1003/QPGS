import {
  approveQuotation,
  createQuotation,
  deleteQuotation,
  generateQuotation,
  getAllQuotations,
  getPendingQuotations,
  getQuotationById,
  getRecentQuotations,
  updateQuotation,
} from '@/handlers/v1/quotations.handler'
import { ensureAdmin, ensureLogin } from '@/middlewares/auth.middleware'
import { naive_isQuotationOwnerOrAdmin } from '@/middlewares/naive.middleware'
import express from 'express'

export const quotationsRouter = express.Router()

// Admin and user (but its own resource only)
quotationsRouter.get('/', ensureLogin, getAllQuotations)

// Admin and user
quotationsRouter.post('/', ensureLogin, createQuotation)

// Admin and user (own)
quotationsRouter.get('/recent', ensureLogin, getRecentQuotations)

// Admin
quotationsRouter.get('/pending', ensureLogin, ensureAdmin, getPendingQuotations)

// Admin
quotationsRouter.put('/:quotationId/approve', ensureLogin, ensureAdmin, approveQuotation)

// Admin and resource owner
quotationsRouter.get(
  '/:quotationId/generate',
  ensureLogin,
  naive_isQuotationOwnerOrAdmin,
  generateQuotation,
)

// Admin and resource owner
quotationsRouter.get('/:quotationId', ensureLogin, naive_isQuotationOwnerOrAdmin, getQuotationById)

// Admin and resource owner
quotationsRouter.put('/:quotationId', ensureLogin, naive_isQuotationOwnerOrAdmin, updateQuotation)

// Admin and resource owner
quotationsRouter.delete(
  '/:quotationId',
  ensureLogin,
  naive_isQuotationOwnerOrAdmin,
  deleteQuotation,
)
