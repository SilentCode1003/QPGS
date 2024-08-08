import { prisma } from '@/db/prisma'
import { createQuotationCommentBodyDto } from '@/dtos/v1/comments/create-comment.dto'
import {
  getQuotationCommentsParamDto,
  getQuotationCommentsQueryDto,
} from '@/dtos/v1/comments/get-comments.dto'
import {
  updateQuotationCommentBodyDto,
  updateQuotationCommentParamDto,
} from '@/dtos/v1/comments/update-comment.dto'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import type { RequestHandler } from 'express'

export const getQuotationComments: RequestHandler = async (req, res, next) => {
  const validatedParam = getQuotationCommentsParamDto.safeParse(req.params)

  if (!validatedParam.success) {
    return res.status(400).json({ message: validatedParam.error.errors })
  }

  const validatedQuery = getQuotationCommentsQueryDto.safeParse(req.query)

  if (!validatedQuery.success) {
    return res.status(400).json({ message: validatedQuery.error.errors })
  }

  try {
    const comments = await prisma.quotation_comment.findMany({
      where: {
        quotation_id: validatedParam.data.quotationId,
        ...validatedQuery.data,
      },
      include: {
        commenter_user: {
          select: {
            first_name: true,
            last_name: true,
            username: true,
            role: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    })

    res.status(200).json({ data: comments })
  } catch (error) {
    next(error)
  }
}

export const createQuotationComment: RequestHandler = async (req, res, next) => {
  const validatedParam = getQuotationCommentsParamDto.safeParse(req.params)

  if (!validatedParam.success) {
    return res.status(400).json({ message: validatedParam.error.errors })
  }

  const validatedBody = createQuotationCommentBodyDto.safeParse(req.body)

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.errors })
  }

  try {
    const quotation = await prisma.quotation_comment.create({
      data: {
        ...validatedBody.data,
        quotation_id: validatedParam.data.quotationId,
        commenter_id: req.session.user!.id,
      },
    })

    res.status(200).json({ data: quotation })
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2003': {
          return res.status(400).json({ message: 'Foreign key does not exist' })
        }
      }
    }
    next(error)
  }
}

export const updateQuotationComment: RequestHandler = async (req, res, next) => {
  const validatedParam = updateQuotationCommentParamDto.safeParse(req.params)

  if (!validatedParam.success) {
    return res.status(400).json({ message: validatedParam.error.errors })
  }

  const validatedBody = updateQuotationCommentBodyDto.safeParse(req.body)

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.errors })
  }

  try {
    const quotation = await prisma.quotation_comment.update({
      where: { id: validatedParam.data.commentId },
      data: validatedBody.data,
    })

    res.status(200).json({ data: quotation })
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2025': {
          return res.status(400).json({ message: 'Comment to update not found' })
        }
      }
    }

    next(error)
  }
}

export const deleteQuotationComment: RequestHandler = async (req, res, next) => {
  const validatedParam = updateQuotationCommentParamDto.safeParse(req.params)

  if (!validatedParam.success) {
    return res.status(400).json({ message: validatedParam.error.errors })
  }

  try {
    const quotation = await prisma.quotation_comment.update({
      where: { id: validatedParam.data.commentId },
      data: { is_active: false },
    })

    res.status(200).json({ data: quotation })
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2025': {
          return res.status(400).json({ message: 'Comment to delete not found' })
        }
      }
    }
    next(error)
  }
}
