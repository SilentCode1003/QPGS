import type { RequestHandler } from 'express'
import { z } from 'zod'
import { prisma } from '../db/prisma'

export const getProducts: RequestHandler = async (req, res, next) => {
  try {
    const products = await prisma.product.findMany()

    res.status(200).json({ data: products })
  } catch (err) {
    next(err)
  }
}

export const createProduct: RequestHandler = async (req, res, next) => {
  const bodySchema = z
    .object({
      name: z.string().min(3),
      description: z.string().min(3),
      price: z.number().nonnegative(),
    })
    .strict()

  const validatedBody = bodySchema.safeParse(req.body)

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.errors })
  }

  try {
    const product = await prisma.product.create({
      data: {
        ...validatedBody.data,
      },
    })

    res.status(200).json({ data: product })
  } catch (err) {
    next(err)
  }
}

export const getProduct: RequestHandler = async (req, res, next) => {
  const idSchema = z.object({
    id: z.coerce.number(),
  })

  const validatedId = idSchema.safeParse(req.params)

  if (!validatedId.success) {
    return res.status(400).json({ message: validatedId.error.errors })
  }

  try {
    const product = await prisma.product.findUnique({
      where: {
        id: validatedId.data.id,
      },
    })

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    res.status(200).json({ data: product })
  } catch (err) {
    next(err)
  }
}

export const deleteProduct: RequestHandler = async (req, res, next) => {
  const idSchema = z.object({
    id: z.coerce.number(),
  })

  const validatedId = idSchema.safeParse(req.params)

  if (!validatedId.success) {
    return res.status(400).json({ message: validatedId.error.errors })
  }

  try {
    const product = await prisma.product.delete({
      where: {
        id: validatedId.data.id,
      },
    })

    res.status(200).json({ data: product })
  } catch (err) {
    next(err)
  }
}
