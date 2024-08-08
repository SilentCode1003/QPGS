import { prisma } from '@/db/prisma'
import { createTermsAndConditionsBodyDto } from '@/dtos/v1/terms-and-conditions/create-tac.dto'
import { getTermsAndConditionsByIdParamDto } from '@/dtos/v1/terms-and-conditions/get-tac.dto'
import { getAllTermsAndConditionsQueryDto } from '@/dtos/v1/terms-and-conditions/get-tacs.dto'
import { updateTermsAndConditionsBodyDto } from '@/dtos/v1/terms-and-conditions/update-tac.dto'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import type { RequestHandler } from 'express'

export const getAllTermsAndConditions: RequestHandler = async (req, res, next) => {
  const validatedQuery = getAllTermsAndConditionsQueryDto.safeParse(req.query)

  if (!validatedQuery.success) {
    return res.status(400).json({ message: validatedQuery.error.errors })
  }

  try {
    const termsAndConditions = await prisma.terms_and_conditions_preset.findMany({
      where: {
        ...validatedQuery.data,
      },
    })
    res.status(200).json({ data: termsAndConditions })
  } catch (error) {
    next(error)
  }
}

export const createTermsAndConditions: RequestHandler = async (req, res, next) => {
  const validatedBody = createTermsAndConditionsBodyDto.safeParse(req.body)

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.errors })
  }

  try {
    const termsAndConditions = await prisma.terms_and_conditions_preset.create({
      data: req.body,
    })
    res.status(201).json({ data: termsAndConditions })
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002': {
          return res.status(400).json({ message: 'Terms and conditions already exists' })
        }
        case 'P2003': {
          return res.status(400).json({ message: 'Foreign key does not exist' })
        }
      }
    }

    next(error)
  }
}

export const getTermsAndConditionsById: RequestHandler = async (req, res, next) => {
  const validatedParam = getTermsAndConditionsByIdParamDto.safeParse(req.params)

  if (!validatedParam.success) {
    return res.status(400).json({ message: validatedParam.error.errors })
  }

  try {
    const termsAndConditions = await prisma.terms_and_conditions_preset.findUnique({
      where: {
        id: validatedParam.data.termsAndConditionsId,
        // is_active: true,
      },
    })

    if (!termsAndConditions) {
      return res.status(404).json({ message: 'Terms and conditions not found' })
    }

    res.status(200).json({ data: termsAndConditions })
  } catch (error) {
    next(error)
  }
}

export const updateTermsAndConditions: RequestHandler = async (req, res, next) => {
  const validatedParam = getTermsAndConditionsByIdParamDto.safeParse(req.params)

  if (!validatedParam.success) {
    return res.status(400).json({ message: validatedParam.error.errors })
  }

  const validatedBody = updateTermsAndConditionsBodyDto.safeParse(req.body)

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.errors })
  }

  try {
    const termsAndConditions = await prisma.terms_and_conditions_preset.update({
      where: { id: validatedParam.data.termsAndConditionsId },
      data: validatedBody.data,
    })
    res.status(200).json({ data: termsAndConditions })
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002': {
          return res.status(400).json({ message: 'Terms and conditions already exists' })
        }
        case 'P2003': {
          return res.status(400).json({ message: 'Foreign key does not exist' })
        }
        case 'P2025': {
          return res.status(404).json({ message: 'Terms and conditions not found' })
        }
      }
    }

    next(error)
  }
}

export const deleteTermsAndConditions: RequestHandler = async (req, res, next) => {
  const validatedParam = getTermsAndConditionsByIdParamDto.safeParse(req.params)

  if (!validatedParam.success) {
    return res.status(400).json({ message: validatedParam.error.errors })
  }

  try {
    const termsAndConditions = await prisma.terms_and_conditions_preset.update({
      where: { id: validatedParam.data.termsAndConditionsId },
      data: { is_active: false },
    })
    res.status(200).json({ data: termsAndConditions })
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2003': {
          return res.status(400).json({ message: 'A foreign key is being deleted' })
        }
        case 'P2025': {
          return res.status(404).json({ message: 'Terms and conditions not found' })
        }
      }
    }
    next(error)
  }
}
