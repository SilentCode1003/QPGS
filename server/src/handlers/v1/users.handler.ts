import { CONFIG_CONSTANT } from '@/config/constants.config'
import { prisma } from '@/db/prisma'
import { changePasswordBodyDto } from '@/dtos/v1/users/change-password.dto'
import { createUserBodyDto } from '@/dtos/v1/users/create-user.dto'
import { getUserParamDto } from '@/dtos/v1/users/get-user.dto'
import { updateUserBodyDto, updateUserParamDto } from '@/dtos/v1/users/update-user.dto'
import { InvalidDataError } from '@/utils/error.util'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import bcrypt from 'bcrypt'
import type { RequestHandler } from 'express'

export const getAllUsers: RequestHandler = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        // is_active: true,
      },
      omit: {
        password: true,
        signature: true,
      },
      include: {
        role: true,
      },
    })
    res.json({ data: users })
  } catch (error) {
    next(error)
  }
}

export const createUser: RequestHandler = async (req, res, next) => {
  const validatedBody = createUserBodyDto.safeParse(req.body)

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.errors })
  }

  try {
    const user = await prisma.$transaction(async (tx) => {
      const role = await tx.role.findUnique({
        where: { id: validatedBody.data.role_id },
      })

      if (!role) {
        throw new InvalidDataError('Role_id does not exist')
      }

      if (
        role.name === CONFIG_CONSTANT.DB_ROLE_ADMIN_NAME &&
        validatedBody.data.signature === null
      ) {
        throw new InvalidDataError('Signature is required when creating an admin user')
      } else if (role.name !== CONFIG_CONSTANT.DB_ROLE_ADMIN_NAME && validatedBody.data.signature) {
        throw new InvalidDataError('Signature is only allowed for admin users')
      }

      const user = await tx.user.create({
        data: {
          ...validatedBody.data,
          password: await bcrypt.hash(validatedBody.data.password, 10),
        },
        omit: {
          password: true,
          signature: true,
        },
        include: {
          role: true,
        },
      })

      return user
    })

    res.status(201).json({ data: user })
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002': {
          return res.status(400).json({ message: 'User already exists' })
        }
        case 'P2003': {
          return res.status(400).json({ message: 'Nonexistent foreign key id' })
        }
      }
    }

    if (error instanceof InvalidDataError) {
      return res.status(400).json({ message: error.message })
    }

    next(error)
  }
}

export const getUserById: RequestHandler = async (req, res, next) => {
  const validatedParam = getUserParamDto.safeParse(req.params)

  if (!validatedParam.success) {
    return res.status(400).json({ message: validatedParam.error.errors })
  }

  // naive implementation for checking resource owner
  const user = req.session.user!
  const isAdmin = user.role.name === CONFIG_CONSTANT.DB_ROLE_ADMIN_NAME
  const isOwner = validatedParam.data.userId === user.id

  if (!isAdmin && !isOwner) {
    return res.status(403).json({ message: 'Forbidden' })
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: validatedParam.data.userId,
        // is_active: true,
      },
      omit: {
        password: true,
      },
      include: {
        role: true,
      },
    })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.status(200).json({ data: user })
  } catch (error) {
    next(error)
  }
}

export const updateUserById: RequestHandler = async (req, res, next) => {
  const validatedParam = updateUserParamDto.safeParse(req.params)

  if (!validatedParam.success) {
    return res.status(400).json({ message: validatedParam.error.errors })
  }

  const validatedBody = updateUserBodyDto.safeParse(req.body)

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.errors })
  }

  try {
    const user = await prisma.user.update({
      data: {
        ...validatedBody.data,
        password:
          validatedBody.data.password && (await bcrypt.hash(validatedBody.data.password, 10)),
      },
      where: {
        id: validatedParam.data.userId,
      },
      omit: {
        password: true,
        signature: true,
      },
      include: {
        role: true,
      },
    })

    res.status(200).json({ data: user })
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002': {
          return res.status(400).json({ message: 'User already exists' })
        }
        case 'P2003': {
          return res.status(400).json({ message: 'Unexisting foreign key id' })
        }
        case 'P2025': {
          return res.status(404).json({ message: 'User to update not found' })
        }
      }
    }

    next(error)
  }
}

export const deleteUserById: RequestHandler = async (req, res, next) => {
  const validatedParam = getUserParamDto.safeParse(req.params)

  if (!validatedParam.success) {
    return res.status(400).json({ message: validatedParam.error.errors })
  }

  try {
    const user = await prisma.user.update({
      where: {
        id: validatedParam.data.userId,
      },
      data: {
        is_active: false,
      },
      omit: {
        password: true,
        signature: true,
      },
      include: {
        role: true,
      },
    })

    res.status(200).json({ data: user })
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2003': {
          return res.status(400).json({ message: 'A foreign key is being deleted' })
        }
        case 'P2025': {
          return res.status(404).json({ message: 'User to delete not found' })
        }
      }
    }
    next(error)
  }
}

export const changePassword: RequestHandler = async (req, res, next) => {
  const validatedBody = changePasswordBodyDto.safeParse(req.body)

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.errors })
  }

  try {
    const user = await prisma.user.update({
      where: { id: req.session.user!.id },
      data: {
        password: await bcrypt.hash(validatedBody.data.password, 10),
      },
      omit: {
        signature: true,
        password: true,
      },
    })

    res.status(200).json({ data: user })
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2025': {
          return res.status(404).json({ message: 'User to update not found' })
        }
      }
    }

    next(error)
  }
}
