import type { RequestHandler } from 'express'
import { prisma } from '../db/prisma'
import { numberIdParamSchema } from '../schemas/param.schema'
import { createProductSchema } from '../schemas/product.schema'

export const getProducts: RequestHandler = async (req, res, next) => {
  try {
    const products = await prisma.product.findMany()

    res.status(200).json({ data: products })
  } catch (err) {
    next(err)
  }
}

export const createProduct: RequestHandler = async (req, res, next) => {
  const validatedBody = createProductSchema.safeParse(req.body)

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.format() })
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
  const validatedId = numberIdParamSchema.safeParse(req.params)

  if (!validatedId.success) {
    return res.status(400).json({ message: validatedId.error.format() })
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

export const updateProduct: RequestHandler = async (req, res, next) => {
  const validatedId = numberIdParamSchema.safeParse(req.params)

  if (!validatedId.success) {
    return res.status(400).json({ message: validatedId.error.format() })
  }

  const validatedBody = createProductSchema.safeParse(req.body)

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.format() })
  }

  try {
    const product = await prisma.product.update({
      where: {
        id: validatedId.data.id,
      },
      data: {
        ...validatedBody.data,
      },
    })

    res.status(200).json({ data: product })
  } catch (err) {
    next(err)
  }
}

export const deleteProduct: RequestHandler = async (req, res, next) => {
  const validatedId = numberIdParamSchema.safeParse(req.params)

  if (!validatedId.success) {
    return res.status(400).json({ message: validatedId.error.format() })
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
