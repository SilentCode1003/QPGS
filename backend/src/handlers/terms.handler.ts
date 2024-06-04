import type { RequestHandler } from 'express'
import { prisma } from '../db/prisma'
import { numberIdParamSchema } from '../schemas/param.schema'
import { createPresetSchema } from '../schemas/terms.schema'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

export const getPresets: RequestHandler = async (req, res, next) => {
  try {
    const presets = await prisma.terms_and_conditions_preset.findMany()

    res.status(200).json({ data: presets })
  } catch (err) {
    console.error('Please handle: ', err)
    res.status(400).json(err)
  }
}

export const createPreset: RequestHandler = async (req, res, next) => {
  const validatedBody = createPresetSchema.safeParse(req.body)

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.format() })
  }

  try {
    const preset = await prisma.terms_and_conditions_preset.create({
      data: {
        ...validatedBody.data,
      },
    })

    res.status(200).json({ data: preset })
  } catch (err) {
    console.error('Please handle: ', err)
    res.status(400).json(err)
  }
}

export const getPreset: RequestHandler = async (req, res, next) => {
  const validatedId = numberIdParamSchema.safeParse(req.params)

  if (!validatedId.success) {
    return res.status(400).json({ message: validatedId.error.format() })
  }

  try {
    const preset = await prisma.terms_and_conditions_preset.findUnique({
      where: {
        id: validatedId.data.id,
      },
    })

    if (!preset) {
      return res.status(404).json({ message: 'Terms and conditions preset not found' })
    }

    res.status(200).json({ data: preset })
  } catch (err) {
    console.error('Please handle: ', err)
    res.status(400).json(err)
  }
}

export const updatePreset: RequestHandler = async (req, res, next) => {
  const validatedId = numberIdParamSchema.safeParse(req.params)

  if (!validatedId.success) {
    return res.status(400).json({ message: validatedId.error.format() })
  }

  const validatedBody = createPresetSchema.safeParse(req.body)

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.format() })
  }

  try {
    const preset = await prisma.terms_and_conditions_preset.update({
      where: {
        id: validatedId.data.id,
      },
      data: {
        ...validatedBody.data,
      },
    })

    res.status(200).json({ data: preset })
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      switch (err.code) {
        case 'P2025':
          console.log('Preset to update not found')
          return res
            .status(404)
            .json({ message: 'Terms and conditions preset to update is not found' })
        default:
          console.log('Please handle: ', err)
          return res.status(400).json(err)
      }
    }

    console.error('Please handle: ', err)
    res.status(400).json(err)
  }
}

export const deletePreset: RequestHandler = async (req, res, next) => {
  const validatedId = numberIdParamSchema.safeParse(req.params)

  if (!validatedId.success) {
    return res.status(400).json({ message: validatedId.error.format() })
  }

  try {
    const preset = await prisma.terms_and_conditions_preset.delete({
      where: {
        id: validatedId.data.id,
      },
    })

    res.status(200).json({ data: preset })
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      switch (err.code) {
        case 'P2025':
          console.log('Preset to delete not found')
          return res
            .status(404)
            .json({ message: 'Terms and conditions preset to delete is not found' })
        default:
          console.log('Please handle: ', err)
          return res.status(400).json(err)
      }
    }

    console.error('Please handle: ', err)
    res.status(400).json(err)
  }
}
