import { prisma } from '@/db/prisma'
import { createRoleBodyDto } from '@/dtos/v1/roles/create-role.dto'
import { getRoleParamDto } from '@/dtos/v1/roles/get-role.dto'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import type { RequestHandler } from 'express'

export const getAllRoles: RequestHandler = async (req, res, next) => {
  try {
    const roles = await prisma.role.findMany()
    res.json({ data: roles })
  } catch (error) {
    next(error)
  }
}

export const createRole: RequestHandler = async (req, res, next) => {
  const validatedBody = createRoleBodyDto.safeParse(req.body)

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.errors })
  }

  try {
    const role = await prisma.role.create({
      data: validatedBody.data,
    })
    res.status(201).json({ data: role })
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002': {
          return res.status(400).json({ message: 'Role already exists' })
        }
        case 'P2003': {
          return res.status(400).json({ message: 'Foreign key does not exist' })
        }
      }
    }

    next(error)
  }
}

export const getRoleById: RequestHandler = async (req, res, next) => {
  const validatedParam = getRoleParamDto.safeParse(req.params)

  if (!validatedParam.success) {
    return res.status(400).json({ message: validatedParam.error.errors })
  }

  try {
    const role = await prisma.role.findUnique({
      where: {
        id: validatedParam.data.roleId,
      },
    })

    if (!role) {
      return res.status(404).json({ message: 'Role not found' })
    }

    res.status(200).json({ data: role })
  } catch (error) {
    next(error)
  }
}

export const updateRoleById: RequestHandler = async (req, res, next) => {
  const validatedParam = getRoleParamDto.safeParse(req.params)

  if (!validatedParam.success) {
    return res.status(400).json({ message: validatedParam.error.errors })
  }

  const validatedBody = createRoleBodyDto.safeParse(req.body)

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.errors })
  }

  try {
    const role = await prisma.role.update({
      data: {
        ...validatedBody.data,
      },
      where: {
        id: validatedParam.data.roleId,
      },
    })

    res.status(200).json({ data: role })
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002': {
          return res.status(400).json({ message: 'Role already exists' })
        }
        case 'P2003': {
          return res.status(400).json({ message: 'Foreign key does not exist' })
        }
        case 'P2025': {
          return res.status(404).json({ message: 'Role to update not found' })
        }
      }
    }

    next(error)
  }
}
