import express from 'express'
import { createQuotation, getQuotation, getQuotations } from '../handlers/quotation.handler'
import { isLoggedIn } from '../middlewares/auth.middleware'
import { isAdmin } from '../middlewares/role.middleware'

export const quotationRouter = express.Router()

quotationRouter.get('/', isLoggedIn, isAdmin, getQuotations)
quotationRouter.post('/', isLoggedIn, createQuotation)
quotationRouter.get('/:id', isLoggedIn, getQuotation)
quotationRouter.put('/:id', isLoggedIn)
quotationRouter.delete('/:id', isLoggedIn)

// quotationRouter.get('/', getQuotations)
// quotationRouter.post('/')
// quotationRouter.get('/:id')
// quotationRouter.put('/:id')
// quotationRouter.delete('/:id')
