import {
  createQuotationComment,
  deleteQuotationComment,
  getQuotationComments,
  updateQuotationComment,
} from '@/handlers/v1/comments.handler'
import { ensureLogin } from '@/middlewares/auth.middleware'
import {
  naive_isCommentOwnerOrAdmin,
  naive_isQuotationOwnerOrAdmin,
} from '@/middlewares/naive.middleware'
import { quotationsRouter } from '@/routes/v1/quotations.route'
import express from 'express'

export const quotationCommentsRouter = express.Router()

// Admin and quotation resource owner
quotationsRouter.get(
  '/:quotationId/comments',
  ensureLogin,
  naive_isQuotationOwnerOrAdmin,
  getQuotationComments,
)

// Admin and quotation resource owner
quotationsRouter.post(
  '/:quotationId/comments',
  ensureLogin,
  naive_isQuotationOwnerOrAdmin,
  createQuotationComment,
)

// Admin and resource owner
quotationCommentsRouter.patch(
  '/:commentId',
  ensureLogin,
  naive_isCommentOwnerOrAdmin,
  updateQuotationComment,
)

// Admin and resource owner
quotationCommentsRouter.delete(
  '/:commentId',
  ensureLogin,
  naive_isCommentOwnerOrAdmin,
  deleteQuotationComment,
)
