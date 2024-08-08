import { prisma } from '@/db/prisma'
import { createProductBodyDto } from '@/dtos/v1/products/create-product.dto'
import { getProductByIdParamDto } from '@/dtos/v1/products/get-product.dto'
import { getAllProductsQueryDto } from '@/dtos/v1/products/get-products.dto'
import { updateProductBodyDto } from '@/dtos/v1/products/update-product.dto'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import type { RequestHandler } from 'express'

export const getAllProducts: RequestHandler = async (req, res, next) => {
  const validatedQuery = getAllProductsQueryDto.safeParse(req.query)

  if (!validatedQuery.success) {
    return res.status(400).json({ message: validatedQuery.error.errors })
  }

  try {
    const products = await prisma.product.findMany({
      where: {
        ...validatedQuery.data,
      },
      include: {
        category: {
          select: { name: true },
        },
      },
    })

    res.status(200).json({ data: products })
  } catch (error) {
    next(error)
  }
}

export const createProduct: RequestHandler = async (req, res, next) => {
  const validatedBody = createProductBodyDto.safeParse(req.body)

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.errors })
  }

  try {
    const product = await prisma.product.create({
      data: validatedBody.data,
    })

    res.status(200).json({ data: product })
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002': {
          return res.status(400).json({ message: 'Product already exists' })
        }
        case 'P2003': {
          return res.status(400).json({ message: 'Foreign key does not exist' })
        }
      }
    }

    next(error)
  }
}

export const getProductById: RequestHandler = async (req, res, next) => {
  const validatedParam = getProductByIdParamDto.safeParse(req.params)

  if (!validatedParam.success) {
    return res.status(400).json({ message: validatedParam.error.errors })
  }

  try {
    const product = await prisma.product.findUnique({
      where: {
        id: validatedParam.data.productId,
        // is_active: true,
      },
      include: {
        category: {
          select: { name: true },
        },
      },
    })

    if (!product) {
      return res.status(404).json({ messsage: 'Product not found' })
    }

    res.status(200).json({ data: product })
  } catch (error) {
    next(error)
  }
}

export const updateProduct: RequestHandler = async (req, res, next) => {
  const validatedParam = getProductByIdParamDto.safeParse(req.params)

  if (!validatedParam.success) {
    return res.status(400).json({ message: validatedParam.error.errors })
  }

  const validatedBody = updateProductBodyDto.safeParse(req.body)

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.errors })
  }

  try {
    const product = await prisma.product.update({
      where: {
        id: validatedParam.data.productId,
      },
      data: validatedBody.data,
    })

    res.status(200).json({ data: product })
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002': {
          return res.status(400).json({ message: 'Product already exists' })
        }
        case 'P2003': {
          return res.status(400).json({ message: 'Foreign key does not exist' })
        }
        case 'P2025': {
          return res.status(404).json({ message: 'Product to update not found' })
        }
      }
    }

    next(error)
  }
}

export const deleteProduct: RequestHandler = async (req, res, next) => {
  const validatedParam = getProductByIdParamDto.safeParse(req.params)

  if (!validatedParam.success) {
    return res.status(400).json({ message: validatedParam.error.errors })
  }

  try {
    const product = await prisma.product.update({
      where: { id: validatedParam.data.productId },
      data: {
        is_active: false,
      },
    })

    res.status(200).json({ data: product })
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2003': {
          return res.status(400).json({ message: 'Foreign key does not exist' })
        }
        case 'P2025': {
          return res.status(404).json({ message: 'Product to delete not found' })
        }
      }
    }

    next(error)
  }
}
