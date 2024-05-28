import type { RequestHandler } from 'express'
import { z } from 'zod'
import { prisma } from '../db/prisma.js'

export const getPaymentTypes: RequestHandler = async (req, res, next) => {
  try {
    const productTypes = await prisma.payment_type.findMany()
    res.status(200).json({ data: productTypes })
  } catch (err) {
    next(err)
  }
}

export const createPaymentType: RequestHandler = async (req, res, next) => {
  const bodySchema = z
    .object({
      name: z.string(),
    })
    .strict()

  const validatedBody = bodySchema.safeParse(req.body)

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.errors })
  }

  try {
    const paymentType = await prisma.payment_type.create({
      data: {
        ...validatedBody.data,
      },
    })

    res.status(200).json({ data: paymentType })
  } catch (err) {
    next(err)
  }
}

export const getPaymentType: RequestHandler = async (req, res, next) => {
  const idSchema = z.object({
    id: z.coerce.number(),
  })

  const validatedId = idSchema.safeParse(req.params)

  if (!validatedId.success) {
    return res.status(400).json({ message: validatedId.error.errors })
  }

  try {
    const paymentType = await prisma.payment_type.findUnique({
      where: {
        id: validatedId.data.id,
      },
    })

    if (!paymentType) {
      return res.status(404).json({ message: 'Payment type not found' })
    }

    res.status(200).json({ data: paymentType })
  } catch (err) {
    next(err)
  }
}

export const updatePaymentType: RequestHandler = async (req, res, next) => {
  const idSchema = z.object({
    id: z.coerce.number(),
  })

  const validatedId = idSchema.safeParse(req.params)

  if (!validatedId.success) {
    return res.status(400).json({ message: validatedId.error.errors })
  }

  const bodySchema = z
    .object({
      name: z.string(),
    })
    .strict()

  const validatedBody = bodySchema.safeParse(req.body)

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.errors })
  }

  try {
    const paymentType = await prisma.payment_type.update({
      where: {
        id: validatedId.data.id,
      },
      data: {
        ...validatedBody.data,
      },
    })

    res.status(200).json({ data: paymentType })
  } catch (err) {
    next(err)
  }
}

export const deletePaymentType: RequestHandler = async (req, res, next) => {
  const idSchema = z.object({
    id: z.coerce.number(),
  })

  const validatedId = idSchema.safeParse(req.params)

  if (!validatedId.success) {
    return res.status(400).json({ message: validatedId.error.errors })
  }

  try {
    const paymentType = await prisma.payment_type.delete({
      where: {
        id: validatedId.data.id,
      },
    })

    res.status(200).json({ data: paymentType })
  } catch (err) {
    next(err)
  }
}
