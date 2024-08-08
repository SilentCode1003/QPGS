/**
 * First of all, to the unfortunate person who will maintain this code, I am very sorry.
 * I don't know **** about access control when I'm starting this project. That's why I named this file "naive".
 * Because my implementation is naive. This does not take account future development, it worsens performance by
 * taking and additional sql (transaction? execution?). In short, this piece of code is unmaintainable.
 *
 * I do know now though, that the type of access control list you need in this project is
 * ABAC (Attribute-Based Access Control).
 * There are a few library in nodejs ecosystem which implements ABAC but they're quite old (if that matters).
 * accesscontrol - https://www.npmjs.com/package/accesscontrol
 * casl - https://www.npmjs.com/package/@casl/ability
 *
 * Best of luck.
 */

import { CONFIG_CONSTANT } from '@/config/constants.config'
import { prisma } from '@/db/prisma'
import { getQuotationCommentsParamDto } from '@/dtos/v1/comments/get-comments.dto'
import { updateQuotationCommentParamDto } from '@/dtos/v1/comments/update-comment.dto'
import type { RequestHandler } from 'express'

export const naive_isQuotationOwnerOrAdmin: RequestHandler = async (req, res, next) => {
  // Throw error is used before ensureLogin
  if (!req.session.user) {
    throw new Error('naive middleware is used before a ensureLogin middleware')
  }

  // Go to next middleware which is the handler if admin
  if (req.session.user.role.name === CONFIG_CONSTANT.DB_ROLE_ADMIN_NAME) {
    // Admin so proceed to handler
    next()
    return
  }

  const validatedParam = getQuotationCommentsParamDto.safeParse(req.params)

  if (!validatedParam.success) {
    return res.status(400).json({ message: validatedParam.error.errors })
  }

  try {
    const quotation = await prisma.quotation.findUnique({
      where: { id: validatedParam.data.quotationId },
    })

    if (!quotation) {
      return res.status(403).json({ message: 'Forbidden' })
    }

    if (quotation.created_by_id !== req.session.user.id) {
      return res.status(403).json({ message: 'Forbidden' })
    }

    // Req user is the owner so proceed to handler
    next()
  } catch (error) {
    next(error)
  }
}

export const naive_isCommentOwnerOrAdmin: RequestHandler = async (req, res, next) => {
  // Throw error is used before ensureLogin
  if (!req.session.user) {
    throw new Error('naive middleware is used before a ensureLogin middleware')
  }

  // Go to next middleware which is the handler if admin
  if (req.session.user.role.name === CONFIG_CONSTANT.DB_ROLE_ADMIN_NAME) {
    // Admin so proceed to handler
    next()
    return
  }

  const validatedParam = updateQuotationCommentParamDto.safeParse(req.params)

  if (!validatedParam.success) {
    return res.status(400).json({ message: validatedParam.error.errors })
  }

  try {
    const comment = await prisma.quotation_comment.findUnique({
      where: { id: validatedParam.data.commentId },
    })

    if (!comment) {
      return res.status(403).json({ message: 'Forbidden' })
    }

    if (comment.commenter_id !== req.session.user.id) {
      return res.status(403).json({ message: 'Forbidden' })
    }

    // Req user is the owner so proceed to handler
    next()
  } catch (error) {
    next(error)
  }
}
