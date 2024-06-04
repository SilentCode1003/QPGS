import type { RequestHandler } from 'express'
import { prisma } from '../db/prisma'
import { createClientSchema, updateClientSchema } from '../schemas/client.schema'
import { numberIdParamSchema } from '../schemas/param.schema'

export const getClients: RequestHandler = async (req, res, next) => {
  try {
    const clients = await prisma.client.findMany()

    res.status(200).json({ data: clients })
  } catch (err) {
    next(err)
  }
}

export const createClient: RequestHandler = async (req, res, next) => {
  const validatedBody = createClientSchema.safeParse(req.body)

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.format() })
  }

  try {
    const client = await prisma.client.create({
      data: {
        ...validatedBody.data,
        created_by_id: req.session.user!.id,
      },
    })

    res.status(200).json({ data: client })
  } catch (err) {
    next(err)
  }
}

export const getClient: RequestHandler = async (req, res, next) => {
  const validatedId = numberIdParamSchema.safeParse(req.params)

  if (!validatedId.success) {
    return res.status(400).json({ message: validatedId.error.format() })
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
  const validatedId = numberIdParamSchema.safeParse(req.params)

  if (!validatedId.success) {
    return res.status(400).json({ message: validatedId.error.format() })
  }

  const validatedBody = updateClientSchema.safeParse(req.body)

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.format() })
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
  const validatedId = numberIdParamSchema.safeParse(req.params)

  if (!validatedId.success) {
    return res.status(400).json({ message: validatedId.error.format() })
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
