import type { RequestHandler } from 'express'
import { prisma } from '../db/prisma'
import { numberUserIdSchema } from '../schemas/param.schema'
import { createQuotationSchema } from '../schemas/quotation.schema'
import { generateQuotationId } from '../utils/generate.util'
import { CONSTANT } from '../config/constant.config'

export const getQuotations: RequestHandler = async (req, res, next) => {
  try {
    const quotations = await prisma.quotation.findMany()

    res.status(200).json({ data: quotations })
  } catch (err) {
    next(err)
  }
}

export const getCreatedQuotationsByUserId: RequestHandler = async (req, res, next) => {
  const validatedParam = numberUserIdSchema.safeParse(req.params)

  if (!validatedParam.success) {
    return res.status(400).json({ message: validatedParam.error.format() })
  }

  try {
    const quotations = await prisma.quotation.findMany({
      where: {
        created_by: validatedParam.data.userId,
      },
    })

    res.status(200).json({ data: quotations })
  } catch (err) {
    next(err)
  }
}

export const getApprovedQuotationsByUserId: RequestHandler = async (req, res, next) => {
  const validatedParam = numberUserIdSchema.safeParse(req.params)

  if (!validatedParam.success) {
    return res.status(400).json({ message: validatedParam.error.format() })
  }

  try {
    const quotations = await prisma.quotation.findMany({
      where: {
        approved_by: validatedParam.data.userId,
      },
    })

    res.status(200).json({ data: quotations })
  } catch (err) {
    next(err)
  }
}

export const createQuotation: RequestHandler = async (req, res, next) => {
  const validatedBody = createQuotationSchema.safeParse(req.body)

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.format() })
  }

  const { products } = validatedBody.data

  // TODO: Validate products listed price, vat_ex, vat_inc, and total_amount

  // TODO: Validate grand total

  const calculatedGrandTotal = products.reduce((prev, current) => prev + current.total_amount, 0)

  try {
    const { id, monthYear } = await generateQuotationId()

    const quotation = await prisma.quotation.create({
      data: {
        ...validatedBody.data,
        id,
        month_year: monthYear,
        created_by: req.session.user!.id,
        quotation_status_id: CONSTANT.DB_PENDING_STATUS_ID,
      },
    })
  } catch (err) {
    next(err)
  }
}
