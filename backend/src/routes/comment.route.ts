import express from 'express'
import {
  createComment,
  deleteComment,
  editComment,
  getComment,
  getComments,
  getQuotationComments,
} from '../handlers/comment.handler'
import { isAdmin } from '../middlewares/auth.middleware'
import { quotationRouter } from './quotation.route'

export const commentRouter = express.Router()

// Only Admin can get all comments
commentRouter.get('/', isAdmin, getComments)

// Users can see comments on their own quotations
// Admin can see comments on quotations
quotationRouter.get('/:quotationId/comments', getQuotationComments)

// Users can only comment on their own quotation
// Admin can comment on any quotation
commentRouter.post('/', createComment)

// Users can get info on their own comments
// Admin can get info on any comment
commentRouter.get('/:id', getComment)

// Users can only edit their own comment
// Admin can edit all comments
commentRouter.put('/:id', editComment)

// Users can only delete their own comment
// Admin can delete any comments
commentRouter.delete('/:id', deleteComment)
