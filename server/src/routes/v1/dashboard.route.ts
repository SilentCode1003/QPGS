import {
  getCurrentApprovedQuotationsCount,
  getCurrentApprovedTotalAmount,
  getMostQuotedProducts,
  getPendingQuotationsCount,
  getQuotationCountPerMonth,
} from '@/handlers/v1/dashboard.handler'
import { ensureAdmin, ensureLogin } from '@/middlewares/auth.middleware'
import express from 'express'

export const dashboardRouter = express.Router()

// Admin
dashboardRouter.get('/quotations-per-month', ensureLogin, ensureAdmin, getQuotationCountPerMonth)

// Admin
dashboardRouter.get('/most-quoted-products', ensureLogin, ensureAdmin, getMostQuotedProducts)

// Admin
dashboardRouter.get('/pending-count', ensureLogin, ensureAdmin, getPendingQuotationsCount)

// Admin
dashboardRouter.get(
  '/current-approved-count',
  ensureLogin,
  ensureAdmin,
  getCurrentApprovedQuotationsCount,
)

// Admin
dashboardRouter.get(
  '/current-approved-amount',
  ensureLogin,
  ensureAdmin,
  getCurrentApprovedTotalAmount,
)
