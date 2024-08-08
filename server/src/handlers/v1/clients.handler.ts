import { prisma } from '@/db/prisma'
import { createClientBodyDto } from '@/dtos/v1/clients/create-client.dto'
import { getClientByIdParamDto } from '@/dtos/v1/clients/get-client.dto'
import { getAllClientsQueryDto } from '@/dtos/v1/clients/get-clients.dto'
import { updateClientBodyDto } from '@/dtos/v1/clients/update-client.dto'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import type { RequestHandler } from 'express'

export const getAllClients: RequestHandler = async (req, res, next) => {
  const validatedQuery = getAllClientsQueryDto.safeParse(req.query)

  if (!validatedQuery.success) {
    return res.status(400).json({ message: validatedQuery.error.errors })
  }

  try {
    const clients = await prisma.client.findMany({
      where: {
        ...validatedQuery.data,
      },
      include: {
        created_by_user: {
          select: { first_name: true, last_name: true },
        },
      },
    })

    res.status(200).json({ data: clients })
  } catch (error) {
    next(error)
  }
}

export const createClient: RequestHandler = async (req, res, next) => {
  const validatedBody = createClientBodyDto.safeParse(req.body)

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.errors })
  }

  try {
    const client = await prisma.client.create({
      data: {
        ...validatedBody.data,
        created_by_id: req.session.user!.id,
      },
    })
    res.status(201).json({ data: client })
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002': {
          return res.status(400).json({ message: 'Client already exists' })
        }
        case 'P2003': {
          return res.status(400).json({ message: 'Foreign key does not exist' })
        }
      }
    }
    next(error)
  }
}

export const getClientById: RequestHandler = async (req, res, next) => {
  const validatedParam = getClientByIdParamDto.safeParse(req.params)

  if (!validatedParam.success) {
    return res.status(400).json({ message: validatedParam.error.errors })
  }

  try {
    const client = await prisma.client.findUnique({
      where: {
        id: validatedParam.data.clientId,
        // is_active: true,
      },
      include: {
        created_by_user: {
          select: { first_name: true, last_name: true },
        },
      },
    })

    if (!client) {
      return res.status(404).json({ message: 'Client not found' })
    }

    res.status(200).json({ data: client })
  } catch (error) {
    next(error)
  }
}

export const updateClient: RequestHandler = async (req, res, next) => {
  const validatedParam = getClientByIdParamDto.safeParse(req.params)

  if (!validatedParam.success) {
    return res.status(400).json({ message: validatedParam.error.errors })
  }

  const validatedBody = updateClientBodyDto.safeParse(req.body)

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.errors })
  }

  try {
    const client = await prisma.client.update({
      where: {
        id: validatedParam.data.clientId,
      },
      data: {
        ...validatedBody.data,
      },
    })
    res.status(200).json({ data: client })
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002': {
          return res.status(400).json({ message: 'Client already exists' })
        }
        case 'P2003': {
          return res.status(400).json({ message: 'Foreign key does not exist' })
        }
        case 'P2025': {
          return res.status(404).json({ message: 'Client to update not found' })
        }
      }
    }
    next(error)
  }
}

export const deleteClient: RequestHandler = async (req, res, next) => {
  const validatedParam = getClientByIdParamDto.safeParse(req.params)

  if (!validatedParam.success) {
    return res.status(400).json({ message: validatedParam.error.errors })
  }

  try {
    const client = await prisma.client.update({
      where: {
        id: validatedParam.data.clientId,
      },
      data: {
        is_active: false,
      },
    })
    res.status(200).json({ data: client })
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002': {
          return res.status(400).json({ message: 'Client already exists' })
        }
        case 'P2003': {
          return res.status(400).json({ message: 'Foreign key does not exist' })
        }
        case 'P2025': {
          return res.status(404).json({ message: 'Client to delete not found' })
        }
      }
    }
    next(error)
  }
}
