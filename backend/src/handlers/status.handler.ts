import type { RequestHandler } from 'express'
import { prisma } from '../db/prisma'
import { numberIdParamSchema } from '../schemas/param.schema'
import { createStatusSchema } from '../schemas/status.schema'

export const getStatuses: RequestHandler = async (req, res, next) => {
  try {
    const statuses = await prisma.quotation_status.findMany()

    res.status(200).json({ data: statuses })
  } catch (err) {
    next(err)
  }
}

export const createStatus: RequestHandler = async (req, res, next) => {
  const validatedBody = createStatusSchema.safeParse(req.body)

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.format() })
  }

  try {
    const status = await prisma.quotation_status.create({
      data: {
        ...validatedBody.data,
      },
    })

    res.status(200).json({ data: status })
  } catch (err) {
    next(err)
  }
}

export const getStatus: RequestHandler = async (req, res, next) => {
  const validatedId = numberIdParamSchema.safeParse(req.params)

  if (!validatedId.success) {
    return res.status(400).json({ message: validatedId.error.format() })
  }

  try {
    const status = await prisma.quotation_status.findUnique({
      where: {
        id: validatedId.data.id,
      },
    })

    if (!status) {
      return res.status(404).json({ message: 'Status not found' })
    }

    res.status(200).json({ data: status })
  } catch (err) {
    next(err)
  }
}

export const updateStatus: RequestHandler = async (req, res, next) => {
  const validatedId = numberIdParamSchema.safeParse(req.params)

  if (!validatedId.success) {
    return res.status(400).json({ message: validatedId.error.format() })
  }

  const validatedBody = createStatusSchema.safeParse(req.body)

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.format() })
  }

  try {
    const status = await prisma.quotation_status.update({
      where: {
        id: validatedId.data.id,
      },
      data: {
        ...validatedBody.data,
      },
    })

    res.status(200).json({ data: status })
  } catch (err) {
    next(err)
  }
}

export const deleteStatus: RequestHandler = async (req, res, next) => {
  const validatedId = numberIdParamSchema.safeParse(req.params)

  if (!validatedId.success) {
    return res.status(400).json({ message: validatedId.error.format() })
  }

  try {
    const status = await prisma.quotation_status.delete({
      where: {
        id: validatedId.data.id,
      },
    })

    res.status(200).json({ data: status })
  } catch (err) {
    next(err)
  }
}
