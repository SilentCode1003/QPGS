import type { RequestHandler } from 'express'
import { z } from 'zod'
import { prisma } from '../db/prisma'

export const getTermsAndConditions: RequestHandler = async (req, res, next) => {
  try {
    const termsAndConditions = await prisma.terms_and_conditions.findMany()

    res.status(200).json({ data: termsAndConditions })
  } catch (err) {
    next(err)
  }
}

export const createTermsAndConditions: RequestHandler = async (req, res, next) => {
  const bodySchema = z
    .object({
      summary: z.string().min(5),
      body: z.string().min(5),
    })
    .strict()

  const validatedBody = bodySchema.safeParse(req.body)

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.errors })
  }

  try {
    const termsAndConditions = await prisma.terms_and_conditions.create({
      data: {
        ...validatedBody.data,
      },
    })

    res.status(200).json({ data: termsAndConditions })
  } catch (err) {
    next(err)
  }
}

export const getTermsAndConditionsById: RequestHandler = async (req, res, next) => {
  const idSchema = z.object({
    id: z.coerce.number(),
  })

  const validatedId = idSchema.safeParse(req.params)

  if (!validatedId.success) {
    return res.status(400).json({ message: validatedId.error.errors })
  }

  try {
    const termsAndConditions = await prisma.terms_and_conditions.findUnique({
      where: {
        id: validatedId.data.id,
      },
    })

    if (!termsAndConditions) {
      return res.status(404).json({ message: 'Terms and conditions not found' })
    }

    res.status(200).json({ data: termsAndConditions })
  } catch (err) {
    next(err)
  }
}

export const updateTermsAndConditions: RequestHandler = async (req, res, next) => {
  const idSchema = z.object({
    id: z.coerce.number(),
  })

  const validatedId = idSchema.safeParse(req.params)

  if (!validatedId.success) {
    return res.status(400).json({ message: validatedId.error.errors })
  }

  const bodySchema = z
    .object({
      summary: z.string().min(5),
      body: z.string().min(5),
    })
    .strict()

  const validatedBody = bodySchema.safeParse(req.body)

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.errors })
  }

  try {
    const termsAndConditions = await prisma.terms_and_conditions.update({
      where: {
        id: validatedId.data.id,
      },
      data: {
        ...validatedBody.data,
      },
    })

    res.status(200).json({ data: termsAndConditions })
  } catch (err) {
    next(err)
  }
}

export const deleteTermsAndConditions: RequestHandler = async (req, res, next) => {
  const idSchema = z.object({
    id: z.coerce.number(),
  })

  const validatedId = idSchema.safeParse(req.params)

  if (!validatedId.success) {
    return res.status(400).json({ message: validatedId.error.errors })
  }

  try {
    const termsAndConditions = await prisma.terms_and_conditions.delete({
      where: {
        id: validatedId.data.id,
      },
    })

    res.status(200).json({ data: termsAndConditions })
  } catch (err) {
    next(err)
  }
}
