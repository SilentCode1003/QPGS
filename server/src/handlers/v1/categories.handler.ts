import { prisma } from '@/db/prisma'
import { createCategoryBodyDto } from '@/dtos/v1/categories/create-category.dto'
import { getAllCategoriesQueryDto } from '@/dtos/v1/categories/get-categories.dto'
import { getCategoryByIdParamDto } from '@/dtos/v1/categories/get-category.dto'
import { updateCategoryBodyDto } from '@/dtos/v1/categories/update-category.dto'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import type { RequestHandler } from 'express'

export const getAllCategories: RequestHandler = async (req, res, next) => {
  const validatedQuery = getAllCategoriesQueryDto.safeParse(req.query)

  if (!validatedQuery.success) {
    return res.status(400).json({ message: validatedQuery.error.errors })
  }

  try {
    const categories = await prisma.category.findMany({
      where: {
        ...validatedQuery.data,
      },
    })

    res.status(200).json({ data: categories })
  } catch (error) {
    next(error)
  }
}

export const createCategory: RequestHandler = async (req, res, next) => {
  const validatedBody = createCategoryBodyDto.safeParse(req.body)

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.errors })
  }

  try {
    const category = await prisma.category.create({
      data: validatedBody.data,
    })

    res.status(200).json({ data: category })
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002': {
          return res.status(400).json({ message: 'Category already exists' })
        }
        case 'P2003': {
          return res.status(400).json({ message: 'Foreign key does not exist' })
        }
      }
    }

    next(error)
  }
}

export const getCategoryById: RequestHandler = async (req, res, next) => {
  const validatedParam = getCategoryByIdParamDto.safeParse(req.params)

  if (!validatedParam.success) {
    return res.status(400).json({ message: validatedParam.error.errors })
  }

  try {
    const category = await prisma.category.findUnique({
      where: {
        id: validatedParam.data.categoryId,
        // is_active: true,
      },
    })

    if (!category) {
      return res.status(404).json({ message: 'Category not found' })
    }

    res.status(200).json({ data: category })
  } catch (error) {
    next(error)
  }
}

export const updateCategory: RequestHandler = async (req, res, next) => {
  const validatedParam = getCategoryByIdParamDto.safeParse(req.params)

  if (!validatedParam.success) {
    return res.status(400).json({ message: validatedParam.error.errors })
  }

  const validatedBody = updateCategoryBodyDto.safeParse(req.body)

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.errors })
  }

  try {
    const category = await prisma.category.update({
      data: {
        ...validatedBody.data,
      },
      where: {
        id: validatedParam.data.categoryId,
      },
    })

    res.status(200).json({ data: category })
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002': {
          return res.status(400).json({ message: 'Category already exists' })
        }
        case 'P2003': {
          return res.status(400).json({ message: 'Foreign key does not exist' })
        }
        case 'P2025': {
          return res.status(404).json({ message: 'Category to update not found' })
        }
      }
    }
    next(error)
  }
}

export const deleteCategory: RequestHandler = async (req, res, next) => {
  const validatedParam = getCategoryByIdParamDto.safeParse(req.params)

  if (!validatedParam.success) {
    return res.status(400).json({ message: validatedParam.error.errors })
  }

  try {
    const category = await prisma.category.update({
      where: {
        id: validatedParam.data.categoryId,
      },
      data: {
        is_active: false,
      },
    })

    res.status(200).json({ data: category })
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2003': {
          return res.status(400).json({ message: 'Foreign key does not exist' })
        }
        case 'P2025': {
          return res.status(404).json({ message: 'Category to delete not found' })
        }
      }
    }
    next(error)
  }
}
