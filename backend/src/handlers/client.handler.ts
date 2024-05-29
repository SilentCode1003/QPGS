import type { RequestHandler } from 'express'
import { z } from 'zod'
import { prisma } from '../db/prisma'

export const getClients: RequestHandler = async (req, res, next) => {
  try {
    const clients = await prisma.client.findMany()

    res.status(200).json({ data: clients })
  } catch (err) {
    next(err)
  }
}

export const createClient: RequestHandler = async (req, res, next) => {
  const bodySchema = z
    .object({
      name: z.string(),
      tel_no: z.string().optional(),
      contact_no: z.string(),
      email: z.string().email(),
      address: z.string(),
    })
    .strict()

  const validatedBody = bodySchema.safeParse(req.body)

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.errors })
  }

  try {
    const client = await prisma.client.create({
      data: {
        ...validatedBody.data,
      },
    })

    res.status(200).json({ data: client })
  } catch (err) {
    next(err)
  }
}

export const getClient: RequestHandler = async (req, res, next) => {
  const idSchema = z.object({
    id: z.coerce.number(),
  })

  const validatedId = idSchema.safeParse(req.params)

  if (!validatedId.success) {
    return res.status(400).json({ message: validatedId.error.errors })
  }

  try {
    const client = await prisma.client.findUnique({
      where: {
        id: validatedId.data.id,
      },
    })

    if (!client) {
      return res.status(404).json({ message: 'Client not found' })
    }

    res.status(200).json({ data: client })
  } catch (err) {
    next(err)
  }
}

export const updateClient: RequestHandler = async (req, res, next) => {
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
      tel_no: z.string().optional(),
      contact_no: z.string(),
      email: z.string().email(),
      address: z.string(),
    })
    .strict()

  const validatedBody = bodySchema.safeParse(req.body)

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.errors })
  }

  try {
    const client = await prisma.client.update({
      where: {
        id: validatedId.data.id,
      },
      data: {
        ...validatedBody.data,
      },
    })

    res.status(200).json({ data: client })
  } catch (err) {
    next(err)
  }
}

export const deleteClient: RequestHandler = async (req, res, next) => {
  const idSchema = z.object({
    id: z.coerce.number(),
  })

  const validatedId = idSchema.safeParse(req.params)

  if (!validatedId.success) {
    return res.status(400).json({ message: validatedId.error.errors })
  }

  try {
    const client = await prisma.client.delete({
      where: {
        id: validatedId.data.id,
      },
    })

    res.status(200).json({ data: client })
  } catch (err) {
    next(err)
  }
}
