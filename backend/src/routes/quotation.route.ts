import express from 'express'
import { isLoggedIn } from '../middlewares/auth.middleware'
import { isAdmin } from '../middlewares/role.middleware'
import { createQuotation, getQuotations } from '../handlers/quotation.handler'

export const quotationRouter = express.Router()

quotationRouter.get('/', isLoggedIn, isAdmin, getQuotations)
quotationRouter.post('/', isLoggedIn, createQuotation)
quotationRouter.get('/:id', isLoggedIn)
quotationRouter.put('/:id', isLoggedIn)
quotationRouter.delete('/:id', isLoggedIn)

// quotationRouter.get('/', getQuotations)
// quotationRouter.post('/')
// quotationRouter.get('/:id')
// quotationRouter.put('/:id')
// quotationRouter.delete('/:id')
