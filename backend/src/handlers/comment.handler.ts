import type { RequestHandler } from 'express'
import { prisma } from '../db/prisma'
import { createCommentSchema, updateCommentSchema } from '../schemas/comment.schema'
import { numberIdParamSchema, stringQuotationIdSchema } from '../schemas/param.schema'

export const getComments: RequestHandler = async (req, res, next) => {
  try {
    const comments = await prisma.quotation_comment.findMany()

    res.status(200).json({ data: comments })
  } catch (err) {
    next(err)
  }
}

export const getQuotationComments: RequestHandler = async (req, res, next) => {
  const validatedId = stringQuotationIdSchema.safeParse(req.params)

  if (!validatedId.success) {
    return res.status(400).json({ message: validatedId.error.format() })
  }

  try {
    const comments = await prisma.quotation_comment.findMany({
      where: {
        quotation_id: validatedId.data.quotationId,
      },
    })

    res.status(200).json({ data: comments })
  } catch (err) {
    next(err)
  }
}

export const createComment: RequestHandler = async (req, res, next) => {
  const validatedBody = createCommentSchema.safeParse(req.body)

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.format() })
  }

  try {
    const comment = await prisma.quotation_comment.create({
      data: {
        ...validatedBody.data,
        commenter_id: req.session.user!.id,
      },
    })

    res.status(200).json({ data: comment })
  } catch (err) {
    next(err)
  }
}

export const getComment: RequestHandler = async (req, res, next) => {
  const validatedId = numberIdParamSchema.safeParse(req.params)

  if (!validatedId.success) {
    return res.status(400).json({ message: validatedId.error.format() })
  }

  try {
    const comment = await prisma.quotation_comment.findUnique({
      where: {
        id: validatedId.data.id,
      },
    })

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' })
    }

    res.status(200).json({ data: comment })
  } catch (err) {
    next(err)
  }
}

export const editComment: RequestHandler = async (req, res, next) => {
  const validatedId = numberIdParamSchema.safeParse(req.params)

  if (!validatedId.success) {
    return res.status(400).json({ message: validatedId.error.format() })
  }

  const validatedBody = updateCommentSchema.safeParse(req.body)

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.format() })
  }

  try {
    const comment = await prisma.quotation_comment.update({
      where: {
        id: validatedId.data.id,
      },
      data: {
        ...validatedBody.data,
      },
    })

    res.status(200).json({ data: comment })
  } catch (err) {
    next(err)
  }
}

export const deleteComment: RequestHandler = async (req, res, next) => {
  const validatedId = numberIdParamSchema.safeParse(req.params)

  if (!validatedId.success) {
    return res.status(400).json({ message: validatedId.error.format() })
  }

  try {
    const comment = await prisma.quotation_comment.delete({
      where: {
        id: validatedId.data.id,
      },
    })

    res.status(200).json({ data: comment })
  } catch (err) {
    next(err)
  }
}
