import type { RequestHandler } from 'express'
import { prisma } from '../db/prisma'
import { createCategorySchema } from '../schemas/category.schema'
import { numberIdParamSchema } from '../schemas/param.schema'

export const getCategories: RequestHandler = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany()

    res.status(200).json({ data: categories })
  } catch (err) {
    next(err)
  }
}

export const createCategory: RequestHandler = async (req, res, next) => {
  const validatedBody = createCategorySchema.safeParse(req.body)

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.format() })
  }

  try {
    const category = await prisma.category.create({
      data: {
        ...validatedBody.data,
      },
    })

    res.status(200).json({ data: category })
  } catch (err) {
    next(err)
  }
}

export const getCategory: RequestHandler = async (req, res, next) => {
  const validatedId = numberIdParamSchema.safeParse(req.params)

  if (!validatedId.success) {
    return res.status(400).json({ message: validatedId.error.format() })
  }

  try {
    const category = await prisma.category.findUnique({
      where: {
        id: validatedId.data.id,
      },
    })

    if (!category) {
      return res.status(404).json({ message: 'Category not found' })
    }

    res.status(200).json({ data: category })
  } catch (err) {
    next(err)
  }
}

export const updateCategory: RequestHandler = async (req, res, next) => {
  const validatedId = numberIdParamSchema.safeParse(req.params)

  if (!validatedId.success) {
    return res.status(400).json({ message: validatedId.error.format() })
  }

  const validatedBody = createCategorySchema.safeParse(req.body)

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.format() })
  }

  try {
    const category = await prisma.category.update({
      where: {
        id: validatedId.data.id,
      },
      data: {
        ...validatedBody.data,
      },
    })

    res.status(200).json({ data: category })
  } catch (err) {
    next(err)
  }
}

export const deleteCategory: RequestHandler = async (req, res, next) => {
  const validatedId = numberIdParamSchema.safeParse(req.params)

  if (!validatedId.success) {
    return res.status(400).json({ message: validatedId.error.format() })
  }

  try {
    const category = await prisma.category.delete({
      where: {
        id: validatedId.data.id,
      },
    })

    res.status(200).json({ data: category })
  } catch (err) {
    next(err)
  }
}
